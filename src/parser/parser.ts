import { isRegExp, isFunction } from '@ijusplab/helpers';
import type {
  IDocSchema,
  TParseTree,
  IParsedDocSchema,
  IParsedDocument,
  TOptionsNode,
  IParsedOption,
  IDataOutput
} from './types';
import { Tree } from './tree';
import getDataAsTable from './getDataAsTable';
import parseText from './parseText';

/**
 * Class providing all parsing functionality
 */
export default class Parser {
  private _schemata: IParsedDocSchema[];

  /**
   * The constructor must receive an array of configuration items, each representing a type of parseable text.
   * For example, if CNIS and PLENUS are two types of parseable texts, an array of two configuration items, one for CNIS and the other for PLENUS.
   *
   * @param configItems The array of configuration items
   */
  constructor(schemata: IDocSchema[]) {
    this._schemata = schemata.map((item) => {
      const name = item.name;
      const label = item.label;
      const parseTree = new Tree(item.parseSchema);
      const optionsTree = new Tree(item.optionsSchema);
      const tests = this.parseTests(item.tests, parseTree);
      const preprocessing = item.preprocessing;
      const postprocessing = item.postprocessing;
      return { name, label, preprocessing, postprocessing, tests, parseTree, optionsTree };
    });
  }

  public get schemata(): IParsedDocSchema[] {
    return this._schemata;
  }

  /**
   * Checks which document schema fits the text to be parsed.
   *
   * @param text The text to be parsed
   * @returns The first document schema that fits the text.
   */
  public executeTests(text: string): IParsedDocSchema | null {
    for (let i = 0; i < this._schemata.length; i++) {
      const schema = this._schemata[i];
      const pass = schema.tests.every((pattern) => pattern.test(text));
      if (pass) {
        schema.tests.forEach((pattern) => (pattern.lastIndex = 0));
        return schema;
      }
    }
    return null;
  }

  private parseTests(tests: (string | RegExp)[], parseTree: TParseTree): RegExp[] {
    if (!Array.isArray(tests)) throw new Error(`No tests found in ${parseTree.root.label}!`);
    return tests.map((path: string | RegExp) => {
      if (isRegExp(path)) return new RegExp(path, 'i');
      const found = parseTree.getFromPath(path);
      const child = found.length > 0 ? found[0] : null;
      if (child && isRegExp(child.info.pattern)) return new RegExp(child.info.pattern, 'i');
      throw new Error(`Test path ${path} not found!`);
    });
  }

  /**
   * The main parsing function. Public method that receives the text to be parsed and returns the resulting data with options available.
   *
   * @param text Text to be parsed
   * @returns An object containing all parsed data properly structured in a suitable format.
   */
  public parse(text: string): IParsedDocument | null {
    // Check if text matches any configuration items
    const schema = this.executeTests(text);

    // If not, returns null
    if (schema === null) return null;

    const { preprocessing, postprocessing } = schema;

    // Here is where parsing really takes place
    if (isFunction(preprocessing)) {
      text = preprocessing(text);
    }

    const parseTree = schema.parseTree;
    let outputTree = parseText(parseTree, text);

    if (isFunction(postprocessing)) {
      outputTree = postprocessing(outputTree);
    }

    const options = schema.optionsTree.root.getMyNodes();
    const optionsOutput = options.map((option) => {
      return {
        name: option.name,
        label: option.label,
        overwrites: option.info.overwrites,
        outputTree: outputTree,
        parseTree: parseTree,
        option: option as TOptionsNode
      };
    }) as IParsedOption[];

    return {
      name: schema.name,
      label: schema.label,
      options: optionsOutput
    };
  }

  /**
   * Returns properly data output from selected option.
   *
   * @param optionOutput
   */
  public getDataOutput(optionOutput: IParsedOption): IDataOutput[] {
    const targets = (optionOutput.option as TOptionsNode).getAllLeavesBelow();
    return targets.map((target) => {
      return {
        target: target.info.target,
        data: getDataAsTable(target.value, optionOutput.outputTree, optionOutput.parseTree)
      };
    });
  }

  /**
   * Returns doc schemata in json format.
   */
  public toString(): string {
    const objects = this.schemata.map((item) => {
      return {
        preprocessing: item.preprocessing ? 'Function' : 'undefined',
        postprocessing: item.postprocessing ? 'Function' : 'undefined',
        tests: item.tests.map((test) => test?.toString()),
        parseTree: item.parseTree.root.toObject(),
        optionsTree: item.optionsTree.root.toObject()
      };
    });
    return JSON.stringify(objects, null, 4);
  }
}
