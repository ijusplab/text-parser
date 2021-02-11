import { cloneDeep } from '@ijusplab/helpers';
import type { ICompactNodeObject, INodeObject } from './interfaces';
import Leaf from './leaf';

export default class Node<V, NI, LI> {
  readonly _path: string;
  readonly _name: string;
  readonly _label: string;
  readonly _parent: Node<V, NI, LI> | null;
  readonly _info: NI;
  private _children: (Node<V, NI, LI> | Leaf<V, NI, LI>)[] = [];

  constructor(name: string, label: string, parent?: Node<V, NI, LI>, info?: NI) {
    this._name = name;
    this._label = label;
    this._parent = parent ?? null;
    this._path = this._parent === null ? '' : this._parent.path ? `${this._parent.path}.${name}` : `${name}`;
    this._info = cloneDeep(info) as NI;
  }

  public get path(): string {
    return this._path;
  }

  public get name(): string {
    return this._name;
  }

  public get label(): string {
    return this._label;
  }

  public get parent(): Node<V, NI, LI> | null {
    return this._parent;
  }

  public get info(): NI {
    return this._info;
  }

  public get children(): (Node<V, NI, LI> | Leaf<V, NI, LI>)[] {
    return this._children;
  }

  public set children(children: (Node<V, NI, LI> | Leaf<V, NI, LI>)[]) {
    this._children = children;
  }

  public isRoot(): boolean {
    return this.parent === null;
  }

  public isLeaf(): this is Leaf<V, NI, LI> {
    return false;
  }

  public addBranch(name: string, label: string, info?: NI): Node<V, NI, LI> {
    const node = new Node<V, NI, LI>(name, label, this, info);
    this._children.push(node);
    return node;
  }

  public addLeaf(name: string, label: string, value: V, info?: LI): Leaf<V, NI, LI> {
    const node = new Leaf(name, label, this, value, info);
    this._children.push(node);
    return node;
  }

  public hasChildren(): boolean {
    return this._children.length > 0;
  }

  public getMyNodes(): Node<V, NI, LI>[] {
    return this._children.filter((child) => child instanceof Node) as Node<V, NI, LI>[];
  }

  public getMyLeaves(): Leaf<V, NI, LI>[] {
    return this._children.filter((child) => child instanceof Leaf) as Leaf<V, NI, LI>[];
  }

  public getAllNodesBelow(): Node<V, NI, LI>[] {
    const all = [] as Node<V, NI, LI>[];
    const nodes = this.getMyNodes();
    nodes.forEach((node) => {
      all.push(node);
      node.getAllNodesBelow().forEach((childNode) => all.push(childNode));
    });
    return all;
  }

  public getAllLeavesBelow(): Leaf<V, NI, LI>[] {
    const all = this.getMyLeaves();
    this.getMyNodes().forEach((node) => {
      node.getAllLeavesBelow().forEach((childLeaf) => all.push(childLeaf));
    });
    return all;
  }

  public getFromPath(path: string): (Node<V, NI, LI> | Leaf<V, NI, LI>)[] {
    if (this.path === path) return [this];
    const all = [] as (Node<V, NI, LI> | Leaf<V, NI, LI>)[];
    this._children.forEach((child) => {
      if (child.path === path) {
        all.push(child);
      } else {
        if (child instanceof Node) {
          const children = child.getFromPath(path);
          children.forEach((child) => all.push(child));
        }
      }
    });
    return all;
  }

  public getNodesFromPath(path: string): Node<V, NI, LI>[] {
    const found = this.getFromPath(path);
    return found.filter((maybe) => maybe instanceof Node) as Node<V, NI, LI>[];
  }

  public getAllNodesFromPath(path: string): Node<V, NI, LI>[] {
    const all = [] as Node<V, NI, LI>[];
    const nodes = this.getNodesFromPath(path);
    nodes.forEach((node) => {
      all.push(node);
      node.getAllNodesBelow().forEach((childNode) => all.push(childNode));
    });
    return all;
  }

  public getLeavesFromPath(path: string): Leaf<V, NI, LI>[] {
    const found = this.getFromPath(path);
    return found.filter((maybe) => maybe instanceof Leaf) as Leaf<V, NI, LI>[];
  }

  public getAllLeavesFromPath(path: string): Leaf<V, NI, LI>[] {
    const all = [] as Leaf<V, NI, LI>[];
    this.getLeavesFromPath(path).forEach((leaf) => all.push(leaf));
    this.getNodesFromPath(path).forEach((node) => {
      node.getAllLeavesBelow().forEach((childLeaf) => all.push(childLeaf));
    });
    return all;
  }

  public getValuesFromPath(path: string): V[] {
    const leaves = this.getLeavesFromPath(path);
    return leaves.map((leaf) => leaf.value);
  }

  public getLabelsFromPath(path: string): string[] {
    const leaves = this.getLeavesFromPath(path);
    return leaves.map((leaf) => leaf.label);
  }

  public getAllValuesFromPath(path: string): V[] {
    const leaves = this.getAllLeavesFromPath(path);
    return leaves.map((leaf) => leaf.value);
  }

  public getAllLabelsFromPath(path: string): string[] {
    const leaves = this.getAllLeavesFromPath(path);
    return leaves.map((leaf) => leaf.label);
  }

  public toObject(): INodeObject {
    return {
      path: this._path,
      name: this._name,
      label: this._label,
      children: this._children.map((child) => child.toObject())
    };
  }

  public toCompactObject(): ICompactNodeObject {
    const object = this._children.reduce((reduced, child) => {
      if (child.isLeaf()) {
        reduced[child.name] = child.getValueAsString();
      } else {
        if (!Array.isArray(reduced[child.name])) {
          reduced[child.name] = [];
        }
        (reduced[child.name] as ICompactNodeObject[]).push(child.toCompactObject());
      }
      return reduced;
    }, {} as ICompactNodeObject);
    const keys = Object.keys(object) as Array<keyof ICompactNodeObject>;
    keys.forEach((key) => {
      const item = object[key];
      if (Array.isArray(item) && item.length === 1) {
        object[key] = item[0];
      }
    });
    return object;
  }

  public toString(): string {
    return JSON.stringify(this.toObject(), null, 4);
  }
}
