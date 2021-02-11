import { concatTables } from '@ijusplab/helpers';
import type { ITableSchema, TOutputTable, TOutputTree, TParseTree } from '../types';
import parseTableSchema from './parseTableSchema';

/**
 * Transforms data from outputTree into two-dimensional array following specifications given in the table schema.
 *
 * @param schema An array of table schemas
 * @param outputTree The data tree
 * @param parseTree The parse tree
 * @returns The data table resulting from all table schemas
 */
export default function getDataAsTable(
  schema: ITableSchema[],
  outputTree: TOutputTree,
  parseTree: TParseTree
): TOutputTable {
  let outputTable = [] as TOutputTable;

  // Each table schema may have one or more sections.
  // Each section is an object like the following:
  // {
  //   node: 'vinculo',
  //   move: DIRECTION.RIGHT,
  //   orderBy: ['salario.competencia', { from: '1964-10-01', to: 'max', fillIn: true, desc: false }],
  //   format: [
  //     [ 'salario.valor' ]
  //   ]
  // }

  schema.forEach((tableSchema) => {
    const table = parseTableSchema(tableSchema, outputTree, parseTree);
    outputTable = concatTables(outputTable, table);
  });

  return outputTable;
}
