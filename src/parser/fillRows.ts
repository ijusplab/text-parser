import { range } from '@ijusplab/helpers';
import type { DataTable } from '../types';

/**
 * Receives table and assures all of its rows have the same number of columns.
 * Fills in the row with empty cells whenever needed to complete missing columns.
 *
 * @param rows Array of rows
 * @returns Propor DataTable
 */
export default function fillRows(rows: DataTable): DataTable {
  // gets max col number
  const maxCols = rows.reduce((max, row) => Math.max(max, row.length), 0);

  return rows.map((row) => {
    if (row.length < maxCols) {
      const emptyRow = range(maxCols - row.length).map(() => null);
      return Array.prototype.concat(row, emptyRow);
    } else {
      return row;
    }
  });
}
