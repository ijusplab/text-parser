import type { TOutputTable, TOutputValue } from '../types';

export default function valuesToTable(valueItems: Record<string, TOutputValue>[], format: string[][]): TOutputTable {
  if (valueItems.length === 0) return createOne({}, format);
  const table: TOutputTable = [];
  valueItems.forEach((valueItem) => createOne(valueItem, format).forEach((row) => table.push(row)));
  return table;
}

function createOne(valueItem: Record<string, TOutputValue>, format: string[][]): TOutputTable {
  return format.map((row) => {
    return row.map((cell) => valueItem[cell] ?? null);
  });
}
