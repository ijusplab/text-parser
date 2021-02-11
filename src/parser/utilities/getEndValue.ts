import { isDate, isNumber } from '@ijusplab/helpers';
import type { TOutputValue, TOptionsTo, TParseParameters } from '../types';
import getSortValue from './getSortValue';

/**
 * Gets the minimum value among the sorted values and the "from" value.
 * TOptionsTo = string | number | Date | 'max' | 'today';
 *
 * @param valueItems
 * @param targetKey
 * @param parseParams
 * @param to
 */
export default function getEndValue(
  valueItems: Record<string, TOutputValue>[],
  targetKey: string,
  parseParams: TParseParameters,
  to?: TOptionsTo
): number {
  if (isNumber(to)) return to;
  if (isDate(to)) return to.valueOf();
  if (!to || to === 'max') return getMax(valueItems, targetKey, parseParams);
  if (to === 'today') return new Date().valueOf();

  const value = getSortValue(to, parseParams);
  if (isNumber(value)) return value;

  return getMax(valueItems, targetKey, parseParams);
}

function getMax(values: Record<string, TOutputValue>[], targetKey: string, parseParams: TParseParameters) {
  return Math.max(...values.map((value) => getSortValue(value[targetKey], parseParams)).filter(isNumber));
}
