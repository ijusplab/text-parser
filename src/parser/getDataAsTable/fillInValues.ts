import { DURATION_TYPES, CDate, isNumber } from '@ijusplab/helpers';
import { TOutputValue, VALUE_FORMAT_TYPES, TOptionsFrom, TOptionsTo, TParseParameters } from '../types';
import { getStartValue, getEndValue, getParseOptions } from '../utilities';
import fillInDates from './fillInDates';
import fillInNumbers from './fillInNumbers';

export default function fillInValues(
  valueItems: Record<string, TOutputValue>[],
  targetKey: string,
  parseParams: TParseParameters,
  from: TOptionsFrom = 'min',
  to: TOptionsTo = 'max'
): Record<string, TOutputValue>[] {
  if (!Array.isArray(valueItems) || valueItems.length === 0) return valueItems;

  const start = getStartValue(valueItems, targetKey, parseParams, from);
  const end = getEndValue(valueItems, targetKey, parseParams, to);
  if (!isNumber(start) || !isNumber(end)) return valueItems;

  const { toType } = getParseOptions(parseParams);

  switch (toType) {
    case VALUE_FORMAT_TYPES.DATE:
      return fillInDates(valueItems, targetKey, new Date(start), new Date(end), DURATION_TYPES.DAYS, parseParams);

    case VALUE_FORMAT_TYPES.DATE_STRING:
      return fillInDates(valueItems, targetKey, new Date(start), new Date(end), DURATION_TYPES.DAYS, parseParams);

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      return fillInDates(valueItems, targetKey, new Date(start), new Date(end), DURATION_TYPES.DAYS, parseParams);

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      try {
        return fillInDates(valueItems, targetKey, new Date(start), new Date(end), DURATION_TYPES.DAYS, parseParams);
      } catch (e) {
        console.log(from, to, start, end, valueItems);
        throw new Error(e.message);
      }

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      return fillInDates(valueItems, targetKey, new Date(start), new Date(end), DURATION_TYPES.DAYS, parseParams);

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE:
      try {
        return fillInDates(
          valueItems,
          targetKey,
          new CDate(new Date(start)).getCompetence(),
          new CDate(new Date(end)).getCompetence(),
          DURATION_TYPES.MONTHS,
          parseParams
        );
      } catch (e) {
        console.log(from, to, start, end, valueItems);
        throw new Error(e.message);
      }

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      try {
        return fillInDates(
          valueItems,
          targetKey,
          new CDate(new Date(start)).getCompetence(),
          new CDate(new Date(end)).getCompetence(),
          DURATION_TYPES.MONTHS,
          parseParams
        );
      } catch (e) {
        console.log(from, to, start, end, valueItems);
        throw new Error(e.message);
      }

    case VALUE_FORMAT_TYPES.NUMBER:
      return fillInNumbers(valueItems, targetKey, start, end, parseParams);

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      return fillInNumbers(valueItems, targetKey, start, end, parseParams);

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      return fillInNumbers(valueItems, targetKey, start, end, parseParams);

    default:
      throw new Error(`O formato ${toType} não pode ser utilizado para criar um intervalo!`);
  }
}
