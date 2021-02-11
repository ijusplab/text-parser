import type { INode, ILeaf, INodeObject, ICompactNodeObject } from './interfaces';
import Node from './node';
import type Leaf from './leaf';

export default class Tree<V, NI, LI> {
  readonly _root: Node<V, NI, LI>;

  constructor(tree: INode<V, NI, LI>);
  constructor(name: string, label: string);
  constructor(...args: unknown[]) {
    if (args.length === 1) {
      this._root = this.parseTree(args[0] as INode<V, NI, LI>);
    } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
      this._root = new Node(args[0], args[1]);
    } else {
      throw new Error('Invalid arguments for tree constructor!');
    }
  }

  private parseNode(node: INode<V, NI, LI> | ILeaf<V, LI>, parent: Node<V, NI, LI>) {
    if ('children' in node && Array.isArray(node.children)) {
      const newBrach = parent.addBranch(node.name, node.label, node.info as NI);
      node.children.forEach((child) => this.parseNode(child, newBrach));
    } else if ('value' in node) {
      parent.addLeaf(node.name, node.label, node.value, node.info as LI);
    } else {
      throw new Error(`Unable to parse ${node.name} (${node.label})!`);
    }
  }

  private parseTree(root: INode<V, NI, LI>): Node<V, NI, LI> {
    const rootNode = new Node<V, NI, LI>(root.name, root.label, undefined, root.info);
    if (Array.isArray(root.children)) {
      root.children.forEach((child) => this.parseNode(child, rootNode));
    }
    return rootNode;
  }

  public get root(): Node<V, NI, LI> {
    return this._root;
  }

  public getFromPath(path: string): (Node<V, NI, LI> | Leaf<V, NI, LI>)[] {
    return this.root.getFromPath(path);
  }

  public getNodesFromPath(path: string): Node<V, NI, LI>[] {
    return this.root.getNodesFromPath(path);
  }

  public getAllNodesFromPath(path: string): Node<V, NI, LI>[] {
    return this.root.getAllNodesFromPath(path);
  }

  public getLeavesFromPath(path: string): Leaf<V, NI, LI>[] {
    return this.root.getLeavesFromPath(path);
  }

  public getAllLeavesFromPath(path: string): Leaf<V, NI, LI>[] {
    return this.root.getAllLeavesFromPath(path);
  }

  public getValuesFromPath(path: string): V[] {
    return this.root.getValuesFromPath(path);
  }

  public getAllValuesFromPath(path: string): V[] {
    return this.root.getAllValuesFromPath(path);
  }

  public toObject(): { [key: string]: INodeObject } {
    return { [this.root.name]: this.root.toObject() };
  }

  public toCompactObject(): { [key: string]: ICompactNodeObject } {
    return { [this.root.name]: this.root.toCompactObject() };
  }

  public toString(): string {
    return JSON.stringify(this.toObject(), null, 4);
  }
}
