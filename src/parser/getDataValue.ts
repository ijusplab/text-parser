import type { ParseParameters, DataValue } from '../types';
import { VALUE_FORMAT_TYPES } from '../types';
import getParseOptions from './getParseOptions';
import successOrNull from './successOrNull';
import cleanString from './cleanString';
import {
  isString,
  CDate,
  parseFloatLocale,
  toLocaleNumberFormat,
  toCurrency,
  toLocalePercentFormat
} from '@ijusplab/helpers';

/**
 * Parses a string into the type defined in the `parseParams` object.
 *
 * @param value The value to be parsed
 * @param parseParams The parameters defining how the value should be parsed
 * @returns The parsed value. In case an error occurs, returns null.
 */
export default function getDataValue(value: string, params: ParseParameters): DataValue | null {
  if (!isString(value)) return null;

  const { toType, locale, currencyCode, numberPrecision } = getParseOptions(params);

  value = cleanString(value);

  switch (toType) {
    case VALUE_FORMAT_TYPES.STRING:
      return value;

    case VALUE_FORMAT_TYPES.BOOLEAN:
      return Boolean(value);

    case VALUE_FORMAT_TYPES.NUMBER:
      return successOrNull(() => parseFloatLocale(value));

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      return successOrNull(() => parseFloatLocale(value).toFixed(numberPrecision || 0));

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      return successOrNull(() => toLocaleNumberFormat(value, numberPrecision, locale));

    case VALUE_FORMAT_TYPES.DATE:
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).getNative());

    case VALUE_FORMAT_TYPES.DATE_STRING:
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).toString());

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).toISOString());

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      if (isString(locale)) {
        return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).setLocale(locale).toLocaleString());
      }
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).toLocaleString());

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      if (isString(locale)) {
        return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).setLocale(locale).humanized());
      }
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).humanized());

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE:
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).getCompetence());

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      if (isString(locale)) {
        return successOrNull(() =>
          new CDate(CDate.stringToDate(value, locale)).setLocale(locale).getCompetenceAsString()
        );
      }
      return successOrNull(() => new CDate(CDate.stringToDate(value, locale)).getCompetenceAsString());

    case VALUE_FORMAT_TYPES.CURRENCY_STRING:
      return successOrNull(() => toCurrency(parseFloatLocale(value), currencyCode, locale));

    case VALUE_FORMAT_TYPES.PERCENT:
      return successOrNull(() => parseFloatLocale(value) * 100);

    case VALUE_FORMAT_TYPES.PERCENT_STRING:
      return successOrNull(() => toLocalePercentFormat(value, numberPrecision, locale));

    default:
      return null;
  }
}
