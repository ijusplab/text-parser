import type {
  ParseTree,
  ParseNode,
  ParseLeaf,
  DataTree,
  DataValue,
  DataNodeInfo,
  DataLeafInfo,
  IDataNode,
  IDataLeaf
} from '../types';
import { Tree } from '../types';
import getDataValue from './getDataValue';
import groupChildren from './groupChildren';
import { isString } from '@ijusplab/helpers';

/**
 * Parses the input text, iterating recursively through all parameters given in the configuration object.
 * In each recursive call, only a fragment of the text is passed as a parameter, so the parsing is progressively narrowed.
 *
 * @param schema The parsing schema
 * @param text Text to be parsed
 * @returns An object presenting a data node consisting of a key having the name of the node, which holds an inner object with keys <name>, <label> and <value>.
 */
export default function parseText(parseTree: ParseTree, text: string): DataTree {
  // Creates data object that will be returned
  const root = createTree(parseTree.root, text);
  return new Tree<DataValue, DataNodeInfo, DataLeafInfo>(root);
}

function createTree(parseNode: ParseNode, text: string): IDataNode {
  return createDataNode(parseNode, text);
}

function createDataNode(parseNode: ParseNode, text: string): IDataNode {
  const name = parseNode.name;
  const label = parseNode.label;

  let match: string | null;

  if (parseNode.info && parseNode.info.pattern) {
    let { pattern } = parseNode.info;
    pattern = new RegExp(parseNode.info.pattern, 'i');
    const parsed = pattern.exec(text);
    match = Array.isArray(parsed) ? parsed[parsed.length - 1] : null;
  } else {
    match = text;
  }

  if (match === null) return { name, label, children: [] };

  const children = createDataNodeChildren(parseNode, match);
  return { name, label, children };
}

function createDataLeaf(parseLeaf: ParseLeaf, text: string): IDataLeaf {
  const name = parseLeaf.name;
  const label = parseLeaf.label;
  const pattern = new RegExp(parseLeaf.info.pattern, 'i');
  const parsed = pattern.exec(text);
  const from = Array.isArray(parsed) ? parsed[parsed.length - 1] : null;
  const value = getDataValue(from ?? '', parseLeaf.value);
  return { name, label, value };
}

function splitNode(parseNode: ParseNode, text: string): IDataNode[] {
  const nodes = [] as IDataNode[];
  const { groupBy, pattern } = parseNode.info;

  if (isString(groupBy)) {
    const matches = text.match(new RegExp(pattern, 'gi'));

    if (Array.isArray(matches)) {
      const all = matches.map((match) => {
        return createDataNode(parseNode, match);
      });
      return groupChildren(all, parseNode.info);
    }
  }
  return nodes;
}

function createDataNodeChildren(parseNode: ParseNode, text: string): (IDataNode | IDataLeaf)[] {
  const children = [] as (IDataNode | IDataLeaf)[];

  parseNode.getChildren().forEach((child) => {
    if (child.isLeaf()) {
      children.push(createDataLeaf(child, text));
    } else if (isString(child.info.groupBy)) {
      splitNode(child, text).forEach((child) => {
        children.push(child);
      });
    } else {
      children.push(createDataNode(child, text));
    }
  });
  return children;
}
