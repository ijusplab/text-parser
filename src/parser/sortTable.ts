import { isNumber, isString } from '@ijusplab/helpers';
import { DataTable, VALUE_FORMAT_TYPES } from '../types';
import getSortValue from './getSortValue';

/**
 * Sorts table by the values stored in its first column.
 *
 * @param table The table to be sorted
 * @param format The format os the values stored in the first column
 * @param locale The locale used for formatting
 * @param desc Whether sorting should the in descending order
 */
export default function sortTable(
  table: DataTable,
  format: VALUE_FORMAT_TYPES,
  locale?: string,
  desc = false
): DataTable {
  const factor = desc ? -1 : 1;

  const mapped = table.map((row, index) => {
    return { index, value: getSortValue(row[0], format, locale) };
  });

  if (format === VALUE_FORMAT_TYPES.STRING) {
    const collator = new Intl.Collator(locale);
    mapped.sort((a, b) => {
      if (!isString(a.value) || !isString(b.value)) return 0;
      return collator.compare(a.value as string, b.value as string) * factor;
    });
  } else {
    mapped.sort((a, b) => {
      if (!isNumber(a.value) || !isNumber(b.value)) return 0;
      return ((a.value as number) - (b.value as number)) * factor;
    });
  }

  const sorted = mapped.map((item) => Array.prototype.concat(item.value, table[item.index].slice(1)));

  return sorted;
}
