import {
  IDataTableSchema,
  DataTree,
  DataTable,
  DataValue,
  DIRECTION,
  ParseTree,
  IDataTableSectionParameters
} from '../types';
import getParseOptions from './getParseOptions';
import fillRows from './fillRows';
import sortTable from './sortTable';
import expandTable from './expandTable';
import { isString, range, zip } from '@ijusplab/helpers';
import getSortOptions from './getSortOptions';

/**
 *
 * @param schema The table's schema
 * @param dataTree The raw data data tree
 * @returns The data table
 */
export default function createDataTable(
  schema: IDataTableSchema[],
  dataTree: DataTree,
  parseTree: ParseTree
): DataTable {
  const dataTable = [] as DataTable;

  // Each table schema may have one or more section
  // Each section is comprised of a paremeters object
  // and a table representing the desired format
  // for that section
  // Example of a section:
  // {
  //   parameters: {
  //     use: 'vinculo', // path to the main group of nodes
  //     move: DIRECTION.RIGHT,
  //     orderBy: 0
  //   },
  //   format: [
  //     [ 'salario.competencia', 'salario.valor' ]
  //   ]
  // }

  schema.forEach((sectionSchema) => {
    const { parameters, format } = sectionSchema;
    const { move } = parameters;
    const blocks = [] as DataTable[];
    format.forEach((rowFormat) => {
      // Gets rows of each block of data as an array of tables
      // Like [ [ [b1-a1, b1-b1, ...], [b1-a2, b1-b2, ...] ], [ [b2-a1, b2-b1, ...], [b2-a2, b2-b2, ...] ], ... ]
      const rowBlocks = createBlocksOfRows(rowFormat, parameters, dataTree, parseTree);
      if (blocks.length === 0) {
        rowBlocks.forEach((rowBlock) => blocks.push(rowBlock));
      } else {
        blocks.forEach((block, index) => {
          if (rowBlocks[index]) {
            rowBlocks[index].forEach((row) => block.push(row));
          }
        });
      }
    });

    const colLength = getMaxColLength(blocks);
    const rowLength = getMaxRowLength(blocks);

    if (move === DIRECTION.RIGHT) {
      const table = [] as DataTable;
      for (let i = 0; i < rowLength; i++) {
        let row = [] as DataValue[];
        for (let j = 0; j < blocks.length; j++) {
          const block = blocks[j];
          if (block[i]) {
            row = Array.prototype.concat(row, block[i]);
          } else {
            const emptyRow = range(colLength).map(() => null);
            row = Array.prototype.concat(row, emptyRow);
          }
        }
        table.push(row);
      }
      table.forEach((row) => dataTable.push(row));
    } else {
      blocks.forEach((block) => {
        block.forEach((row) => {
          dataTable.push(row);
        });
      });
    }
  });

  return fillRows(dataTable);
}

function createBlocksOfRows(
  format: string[],
  { use, orderBy }: IDataTableSectionParameters,
  dataTree: DataTree,
  parseTree: ParseTree
): DataTable[] {
  const maybeDataNodes = dataTree.getFromPath(use);
  const rows = [] as DataTable[];

  // If necessary to sort, add column with values to be sorted
  // That is because I may want to sort by a value that I don't
  // want to keep for display when exporting the table
  const sortKeysPath = Array.isArray(orderBy) ? orderBy[0] : isString(orderBy) ? orderBy : null;
  const paths = sortKeysPath ? Array.prototype.concat(sortKeysPath, format) : format;

  for (let i = 0; i < maybeDataNodes.length; i++) {
    const maybeDataNode = maybeDataNodes[i];

    // We are working with the following format:
    // [ [cell of a values], [cell of b values], etc ]
    // It makes it easier to zip them later
    const cells = paths.map((path) => {
      if (!path) return [null];

      const wantsLabel = path.split('.').slice(-1)[0] === 'label';
      const adjustedPath = wantsLabel ? path.split('.').slice(0, -1).join('.') : path;

      const fullPath = `${maybeDataNode.path}.${adjustedPath}`;
      if (maybeDataNode.isLeaf()) {
        return wantsLabel ? [maybeDataNode.label] : [maybeDataNode.value ?? null];
      } else {
        return wantsLabel
          ? maybeDataNode.getAllLabelsFromPath(fullPath)
          : maybeDataNode.getValuesFromPath(fullPath).map((value) => value ?? null);
      }
    });

    // Unpacks [ [cell of a values], [cell of b values], etc ]
    // to [ [a1, b1, etc], [a2, b2, etc], [a3, b3, etc] ]
    // But still, we are in the same block
    let unpacked = zip(cells, null);

    if (unpacked.length > 0 && orderBy) {
      const parseParams = parseTree.getAllValuesFromPath(`${use}.${sortKeysPath}`);
      if (Array.isArray(parseParams) && parseParams.length > 0) {
        const { toType, locale, numberPrecision } = getParseOptions(parseParams[0]);
        const { orderByPath, desc, expand, from, to } = getSortOptions(orderBy);
        unpacked = sortTable(unpacked, toType, locale, desc);
        if (expand) {
          unpacked = expandTable(unpacked, toType, locale, numberPrecision, from, to);
          // Check if sort column correspond to inner column
          // If positive, fill in blank cells with values from sort column
          const pos = format.indexOf(orderByPath);
          if (pos >= 0) {
            unpacked = unpacked.map((row) => {
              row[pos + 1] = row[pos + 1] || row[0];
              return row;
            });
          }
        }
      } else {
        throw new Error(`Unable to find "${sortKeysPath}" under "${use}" in sort parameter!`);
      }
      // remove sort column added before
      unpacked = unpacked.map((row) => {
        row.shift();
        return row;
      });
    }

    if (unpacked.length > 0) rows.push(unpacked);
  }

  // Returns array of tables, each belonging to a block
  return rows;
}

function getMaxRowLength(blocks: DataTable[]): number {
  return blocks.reduce((max, block) => Math.max(max, block.length), 0);
}

function getMaxColLength(blocks: DataTable[]): number {
  return blocks.reduce((max, block) => {
    block.forEach((row) => {
      max = Math.max(max, row.length);
    });
    return max;
  }, 0);
}
