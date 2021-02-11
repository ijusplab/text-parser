import { range } from '@ijusplab/helpers';
import type { TOutputValue, TParseParameters } from '../types';
import { getOutputValue } from '../utilities';

/**
 * Fills in values ic accordance with date interval defined by `startDate` and `endDate`.
 *
 * @param valueItems
 * @param targetKey
 * @param start
 * @param end
 * @param parseParams
 * @returns The expanded array of values.
 */
export default function fillInNumbers(
  valueItems: Record<string, TOutputValue>[],
  targetKey: string,
  start: number,
  end: number,
  parseParams: TParseParameters
): Record<string, TOutputValue>[] {
  if (valueItems.length === 0) return valueItems;
  const keys = Object.keys(valueItems[0]);

  const createNewRecord = (n: number): Record<string, TOutputValue> => {
    return keys.reduce((reduced, key) => {
      reduced[key] = key === targetKey ? getOutputValue(n, parseParams) : null;
      return reduced;
    }, {} as Record<string, TOutputValue>);
  };

  const unities = end - start + 1;
  return range(unities).map((index) => {
    const record = createNewRecord(start + index);
    const existent = valueItems.find((item) => item[targetKey] === record[targetKey]);
    if (existent) return existent;
    return record;
  });
}
