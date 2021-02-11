import { cloneDeep, isBoolean, isDate, isNumber, isRegExp, isString } from '@ijusplab/helpers';
import type { ILeafObject } from './interfaces';
import type Node from './node';

export default class Leaf<V, NI, LI> {
  readonly _path: string;
  readonly _name: string;
  readonly _label: string;
  readonly _parent: Node<V, NI, LI>;
  readonly _value: V;
  readonly _info: LI;

  constructor(name: string, label: string, parent: Node<V, NI, LI>, value: V, info?: LI) {
    this._path = `${parent.path}.${name}`;
    this._name = name;
    this._label = label;
    this._parent = parent;
    this._value = cloneDeep(value) as V;
    this._info = cloneDeep(info) as LI;
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

  public get parent(): Node<V, NI, LI> {
    return this._parent;
  }

  public get value(): V {
    return this._value;
  }

  public get info(): LI {
    return this._info;
  }

  public isRoot(): boolean {
    return false;
  }

  public isLeaf(): this is Leaf<V, NI, LI> {
    return true;
  }

  public getValueAsString(): string {
    if (this._value === null) return 'null';
    if (this._value === undefined) return 'undefined';
    if (isString(this._value)) return this._value;
    if (isNumber(this._value) || isRegExp(this._value) || isBoolean(this._value) || isDate(this._value)) {
      return this._value.toString();
    }
    return 'unknown type';
  }

  public toObject(): ILeafObject {
    return {
      path: this._path,
      name: this._name,
      label: this._label,
      value: this.getValueAsString()
    };
  }

  public toString(): string {
    return JSON.stringify(this.toObject(), null, 4);
  }
}
