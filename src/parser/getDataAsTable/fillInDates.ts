import { DURATION_TYPES, addToDate, dateDiff, range } from '@ijusplab/helpers';
import type { TOutputValue, TParseParameters } from '../types';
import { getOutputValue } from '../utilities';

/**
 * Fills in values ic accordance with date interval defined by `startDate` and `endDate`.
 *
 * @param valueItems
 * @param targetKey
 * @param startDate
 * @param endDate
 * @param durationType
 * @param parseParams
 * @returns The expanded array of values.
 */
export default function fillInDates(
  valueItems: Record<string, TOutputValue>[],
  targetKey: string,
  startDate: Date,
  endDate: Date,
  durationType: DURATION_TYPES = DURATION_TYPES.MONTHS,
  parseParams: TParseParameters
): Record<string, TOutputValue>[] {
  if (valueItems.length === 0) return valueItems;
  const keys = Object.keys(valueItems[0]);

  const createNewRecord = (date: Date): Record<string, TOutputValue> => {
    return keys.reduce((reduced, key) => {
      reduced[key] = key === targetKey ? getOutputValue(date.valueOf(), parseParams) : null;
      return reduced;
    }, {} as Record<string, TOutputValue>);
  };

  const unities = dateDiff(startDate, endDate, durationType) + 1;
  return range(unities).map((index) => {
    const record = createNewRecord(addToDate(startDate, index, durationType));
    const existent = valueItems.find((item) => item[targetKey] === record[targetKey]);
    if (existent) return existent;
    return record;
  });
}
