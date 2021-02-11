export interface INode<V, NI, LI> {
  name: string;
  label: string;
  info?: NI;
  children: (INode<V, NI, LI> | ILeaf<V, LI>)[];
}

export interface ILeaf<V, LI> {
  name: string;
  label: string;
  info?: LI;
  value: V;
}

export type TClass<T> = new (...args: unknown[]) => T;

export interface INodeObject {
  path: string;
  name: string;
  label: string;
  children: Array<INodeObject | ILeafObject>;
}

export interface ILeafObject {
  path: string;
  name: string;
  label: string;
  value: string;
}

export interface ICompactNodeObject {
  [key: string]: string | ICompactNodeObject | ICompactNodeObject[];
}
