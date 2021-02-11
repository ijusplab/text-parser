import type { Tree, Node, Leaf, INode, ILeaf } from '../tree';
import type { VALUE_FORMAT_TYPES, VALUE_MERGE_STRATEGY } from './enums';
import type { CURRENCY_CODES } from '@ijusplab/helpers';

export type TParseTree = Tree<TParseParameters, IParseNodeInfo, IParseLeafInfo>;
export type TParseNode = Node<TParseParameters, IParseNodeInfo, IParseLeafInfo>;
export type TParseLeaf = Leaf<TParseParameters, IParseNodeInfo, IParseLeafInfo>;

export type IParseNode = INode<TParseParameters, IParseNodeInfo, IParseLeafInfo>;
export type IParseLeaf = ILeaf<TParseParameters, IParseLeafInfo>;

export type TParseSchema = INode<TParseParameters, IParseNodeInfo, IParseLeafInfo>;

export type TParseParameters = VALUE_FORMAT_TYPES | [VALUE_FORMAT_TYPES, IParseNodeOptions];

export interface IParseNodeOptions {
  locale?: `${Lowercase<string>}-${Uppercase<string>}`;
  currencyCode?: CURRENCY_CODES;
  numberPrecision?: number;
}

export interface IParseNodeInfo {
  tests?: (string | RegExp)[];
  pattern: RegExp;
  groupBy?: string; // indicates that the node wants to be grouped with its siblings, by the value of the child indicated here
  preserve?: string | string[]; // indicates what to do with the values of the other children in case of grouping
  mergeStrategy?: VALUE_MERGE_STRATEGY | VALUE_MERGE_STRATEGY[];
}

export interface IParseLeafInfo {
  pattern: RegExp;
}
