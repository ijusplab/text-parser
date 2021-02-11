import { isDate, isNumber } from '@ijusplab/helpers';
import type { TOutputValue, TOptionsFrom, TParseParameters } from '../types';
import getSortValue from './getSortValue';

/**
 * Gets the minimum value among the sorted values and the "from" value.
 * TOptionsFrom = string | number | Date | 'min';
 *
 * @param valueItems
 * @param targetKey
 * @param parseParams
 * @param from
 */
export default function getStartValue(
  valueItems: Record<string, TOutputValue>[],
  targetKey: string,
  parseParams: TParseParameters,
  from?: TOptionsFrom
): number {
  if (isNumber(from)) return from;
  if (isDate(from)) return from.valueOf();
  if (!from || from === 'min') return getMin(valueItems, targetKey, parseParams);

  const value = getSortValue(from, parseParams);
  if (isNumber(value)) return value;

  return getMin(valueItems, targetKey, parseParams);
}

function getMin(values: Record<string, TOutputValue>[], targetKey: string, parseParams: TParseParameters) {
  return Math.min(...values.map((value) => getSortValue(value[targetKey], parseParams)).filter(isNumber));
}
