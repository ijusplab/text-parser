import { filterUnique, flatten, concatTables } from '@ijusplab/helpers';
import { ITableSchema, TOutputTree, TParseTree, TOutputTable, TOutputValue, DIRECTION } from '../types';
import { getValuesFromNode, getSortOptions } from '../utilities';
import sortValues from './sortValues';
import fillInValues from './fillInValues';
import valuesToTable from './valuesToTable';

export default function parseTableSchema(
  { node, move, orderBy, format }: ITableSchema,
  outputTree: TOutputTree,
  parseTree: TParseTree
): TOutputTable {
  const nodes = outputTree.getNodesFromPath(node);
  // If necessary to sort, add path with values to be sorted
  const sortOptions = orderBy ? getSortOptions(orderBy) : null;
  const paths = flatten(sortOptions ? Array.prototype.concat(sortOptions.path, format) : format).filter(
    filterUnique // just in case sortOptions.path was already there
  ) as string[];

  let nodeValues: Record<string, TOutputValue>[][] = nodes.map((someNode) => getValuesFromNode(someNode, paths));

  if (sortOptions) {
    const parseParams = parseTree.getAllValuesFromPath(`${node}.${sortOptions.path}`);
    if (Array.isArray(parseParams) && parseParams.length > 0) {
      const { path, desc, from, to } = sortOptions;
      nodeValues = nodeValues.map((values: Record<string, TOutputValue>[]) => {
        const sorted = sortValues(values, path, desc, parseParams[0]);
        const filled = fillInValues(sorted, path, parseParams[0], from, to);
        return filled;
      });
    }
  }

  let outputTable: TOutputTable = [];
  const toRight = move === DIRECTION.RIGHT;

  nodeValues.forEach((values: Record<string, TOutputValue>[]) => {
    const table = valuesToTable(values, format);
    outputTable = concatTables(outputTable, table, toRight);
  });

  return outputTable;
}
