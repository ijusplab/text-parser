import type { TOptionsTree, TOptionsSchema } from './options';
import type { TParseTree, TParseSchema } from './parse';
import type { TOutputTree } from './output';

export interface IDocSchema {
  name: string;
  label: string;
  tests: (string | RegExp)[];
  preprocessing?: (data: string) => string;
  postprocessing?: (data: TOutputTree) => TOutputTree;
  optionsSchema: TOptionsSchema;
  parseSchema: TParseSchema;
}

export interface IParsedDocSchema {
  name: string;
  label: string;
  tests: RegExp[];
  preprocessing?: (data: string) => string;
  postprocessing?: (data: TOutputTree) => TOutputTree;
  optionsTree: TOptionsTree;
  parseTree: TParseTree;
}
