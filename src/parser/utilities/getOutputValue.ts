import {
  isString,
  cleanString,
  CDate,
  parseFloatLocale,
  toLocaleNumberFormat,
  toCurrency,
  toLocalePercentFormat,
  isNumber
} from '@ijusplab/helpers';
import type { TParseParameters, TOutputValue } from '../types';
import { VALUE_FORMAT_TYPES } from '../types';
import getParseOptions from './getParseOptions';
import successOrNull from './successOrNull';

/**
 * Parses a string or a number into the type defined in the `parseParams` object.
 *
 * @param value The value to be parsed
 * @param parseParams The parameters defining how the value should be parsed
 * @returns The parsed value. In case an error occurs, returns null.
 */
export default function getOutputValue(value: string | number, parseParams: TParseParameters): TOutputValue | null {
  if (!isString(value) && !isNumber(value)) return null;

  const { toType, locale, currencyCode, numberPrecision } = getParseOptions(parseParams);

  if (isString(value)) value = cleanString(value);

  switch (toType) {
    case VALUE_FORMAT_TYPES.STRING:
      return isString(value) ? value : value.toString();

    case VALUE_FORMAT_TYPES.BOOLEAN:
      return Boolean(value);

    case VALUE_FORMAT_TYPES.NUMBER:
      return successOrNull(() => parseFloatLocale(value));

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      return successOrNull(() => parseFloatLocale(value).toFixed(numberPrecision || 0));

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      return successOrNull(() => toLocaleNumberFormat(value, numberPrecision, locale));

    case VALUE_FORMAT_TYPES.DATE:
      return successOrNull(() =>
        isString(value) ? new CDate(CDate.stringToDate(value, locale)).getNative() : new Date(value)
      );

    case VALUE_FORMAT_TYPES.DATE_STRING:
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).toString()
          : new CDate(new Date(value)).toString()
      );

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).toISOString()
          : new CDate(new Date(value)).toISOString()
      );

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      if (isString(locale)) {
        return successOrNull(() =>
          isString(value)
            ? new CDate(CDate.stringToDate(value, locale)).setLocale(locale).toLocaleString()
            : new CDate(new Date(value)).setLocale(locale).toLocaleString()
        );
      }
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).toLocaleString()
          : new CDate(new Date(value)).toLocaleString()
      );

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      if (isString(locale)) {
        return successOrNull(() =>
          isString(value)
            ? new CDate(CDate.stringToDate(value, locale)).setLocale(locale).humanized()
            : new CDate(new Date(value)).setLocale(locale).humanized()
        );
      }
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).humanized()
          : new CDate(new Date(value)).humanized()
      );

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE:
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).getCompetence()
          : new CDate(new Date(value)).getCompetence()
      );

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      if (isString(locale)) {
        return successOrNull(() =>
          isString(value)
            ? new CDate(CDate.stringToDate(value, locale)).setLocale(locale).getCompetenceAsString()
            : new CDate(new Date(value)).setLocale(locale).getCompetenceAsString()
        );
      }
      return successOrNull(() =>
        isString(value)
          ? new CDate(CDate.stringToDate(value, locale)).getCompetenceAsString()
          : new CDate(new Date(value)).getCompetenceAsString()
      );

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
