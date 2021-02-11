import type { Tree, Node, Leaf, INode, ILeaf } from '../tree';
import type { IOptionsNode } from './options';
import type { TParseTree } from './parse';

export type TOutputTree = Tree<TOutputValue, IOutputInfo, IOutputInfo>;
export type TOutputNode = Node<TOutputValue, IOutputInfo, IOutputInfo>;
export type TOutputLeaf = Leaf<TOutputValue, IOutputInfo, IOutputInfo>;

export type IOutputNode = INode<TOutputValue, IOutputInfo, IOutputInfo>;
export type IOutputLeaf = ILeaf<TOutputValue, IOutputInfo>;

export type TOutputValue = string | boolean | number | Date | null | undefined;
export type TOutputTable = TOutputValue[][];

export interface IOutputInfo {
  text: string;
}

export interface IParsedDocument {
  name: string;
  label: string;
  options: IParsedOption[];
}

export interface IParsedOption {
  name: string;
  label: string;
  overwrites: boolean;
  outputTree: TOutputTree;
  parseTree: TParseTree;
  option: IOptionsNode;
}

export interface IDataOutput {
  target: string;
  data: TOutputTable;
}
