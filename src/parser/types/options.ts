import type { DIRECTION } from './enums';
import type { Tree, Node, Leaf, INode, ILeaf } from '../tree';

export type TOptionsTree = Tree<TOptionValue, IOptionsNodeInfo, IOptionsLeafInfo>;
export type TOptionsNode = Node<TOptionValue, IOptionsNodeInfo, IOptionsLeafInfo>;
export type TOptionsLeaf = Leaf<TOptionValue, IOptionsNodeInfo, IOptionsLeafInfo>;

export type IOptionsNode = INode<TOptionValue, IOptionsNodeInfo, IOptionsLeafInfo>;
export type IOptionsLeaf = ILeaf<TOptionValue, IOptionsLeafInfo>;

export type TOptionsSchema = INode<TOptionValue, IOptionsNodeInfo, IOptionsLeafInfo>;

export type TOptionValue = ITableSchema[];

export interface ITableSchema {
  node: string;
  move: DIRECTION;
  orderBy?: string | [string, ISortOptions];
  format: string[][];
}

export interface ISortOptions {
  from?: TOptionsFrom;
  to?: TOptionsTo;
  fillIn?: boolean;
  desc?: boolean;
}

export type TOptionsFrom = string | number | Date | 'min';
export type TOptionsTo = string | number | Date | 'max' | 'today';

export type TSortValue = string | number | null;

export interface IOptionsNodeInfo {
  overwrites: boolean;
}

export interface IOptionsLeafInfo {
  target: string;
}
