import { isString } from '@ijusplab/helpers';
import type {
  TParseTree,
  TParseNode,
  TParseLeaf,
  TOutputTree,
  TOutputValue,
  IOutputNode,
  IOutputLeaf,
  IOutputInfo
} from './types';
import { Tree } from './tree';
import { getOutputValue } from './utilities';
import groupChildren from './groupChildren';

/**
 * Parses the input text, iterating recursively through all parameters given in the configuration object.
 * In each recursive call, only a fragment of the text is passed as a parameter, so the parsing is progressively narrowed.
 *
 * @param schema The parsing schema
 * @param text Text to be parsed
 * @returns An object presenting a data node consisting of a key having the name of the node, which holds an inner object with keys <name>, <label> and <value>.
 */
export default function parseText(parseTree: TParseTree, text: string): TOutputTree {
  // Creates data object that will be returned
  const root = createTree(parseTree.root, text);
  return new Tree<TOutputValue, IOutputInfo, IOutputInfo>(root);
}

function createTree(parseNode: TParseNode, text: string): IOutputNode {
  return createDataNode(parseNode, text);
}

function createDataNode(parseNode: TParseNode, text: string): IOutputNode {
  const name = parseNode.name;
  const label = parseNode.label;

  let match: string | null;

  if (parseNode.info && parseNode.info.pattern) {
    let { pattern } = parseNode.info;
    pattern = new RegExp(parseNode.info.pattern, 'i');
    const parsed = pattern.exec(text);
    match = Array.isArray(parsed) ? parsed[parsed.length - 1] : null;
    if (match === undefined) {
      console.log(name, label, pattern, text, parsed);
    }
  } else {
    match = text;
  }

  if (match === null) return { name, label, children: [] };

  const children = createDataNodeChildren(parseNode, match);
  return { name, label, children, info: { text: match } };
}

function createDataLeaf(parseLeaf: TParseLeaf, text: string): IOutputLeaf {
  const name = parseLeaf.name;
  const label = parseLeaf.label;
  const pattern = new RegExp(parseLeaf.info.pattern, 'i');
  const parsed = pattern.exec(text);
  const from = Array.isArray(parsed) ? parsed[parsed.length - 1] : null;
  const value = getOutputValue(from ?? '', parseLeaf.value);
  return { name, label, value, info: { text } };
}

function splitNode(parseNode: TParseNode, text: string): IOutputNode[] {
  const nodes = [] as IOutputNode[];
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

function createDataNodeChildren(parseNode: TParseNode, text: string): (IOutputNode | IOutputLeaf)[] {
  const children = [] as (IOutputNode | IOutputLeaf)[];

  parseNode.children.forEach((child) => {
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
