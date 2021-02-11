import { isDate, isNumber, isString, mergeSort } from '@ijusplab/helpers';
import { TOutputValue, TParseParameters, VALUE_FORMAT_TYPES } from '../types';
import { getSortValue, getParseOptions } from '../utilities';

/**
 * Sorts arrays of objects in the form { [path]: value } using MergeSort.
 *
 * @param valueItems
 * @param options
 * @returns
 */
export default function sortValues(
  valueItems: Record<string, TOutputValue>[],
  sortKey: string,
  desc = false,
  parseParams: TParseParameters
): Record<string, TOutputValue>[] {
  const { toType, locale } = getParseOptions(parseParams);
  const mapped = valueItems.map((value, index) => {
    const sortValue = getSortValue(value[sortKey], parseParams);
    return { index, [sortKey]: sortValue };
  });

  if (toType === VALUE_FORMAT_TYPES.STRING) {
    const collator = new Intl.Collator(locale);
    mergeSort(mapped, (a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (isString(aValue) && isString(bValue)) {
        const order = collator.compare(aValue, bValue);
        return order === 0 || (desc ? order === -1 : order === 1);
      }
      return true;
    });
  } else {
    mergeSort(mapped, (a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (isNumber(aValue) && isNumber(bValue)) {
        return desc ? aValue <= bValue : aValue >= bValue;
      }
      if (isDate(aValue) && isDate(bValue)) {
        return desc ? aValue.valueOf() <= bValue.valueOf() : aValue.valueOf() >= bValue.valueOf();
      }
      return true;
    });
  }

  return mapped.map((item) => valueItems[item.index]);
}
