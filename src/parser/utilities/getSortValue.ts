import { isNumber, isDate, CDate, parseFloatLocale, isBoolean, isString } from '@ijusplab/helpers';
import type { TOutputValue, TParseParameters, TSortValue } from '../types';
import { VALUE_FORMAT_TYPES } from '../types';
import successOrThrow from './successOrThrow';
import getParseOptions from './getParseOptions';

/**
 * Gets TDataValue in format suitable to be sorted.
 *
 * @param value The TDataValue
 * @param parseParams The parameters informing how the value was parsed
 * @returns The number equivalent or the value itself, if parsed as string.
 */
export default function getSortValue(value: TOutputValue, parseParams: TParseParameters): TSortValue {
  if (value === null || value === undefined || value === '') return null;
  if (isDate(value)) return value.valueOf();
  if (isBoolean(value)) return Number(value);
  const { toType, locale } = getParseOptions(parseParams);

  if (isNumber(value)) {
    if (toType === VALUE_FORMAT_TYPES.STRING) return value.toString();
    if (toType === VALUE_FORMAT_TYPES.PERCENT) return value / 100;
    return value;
  }

  switch (toType) {
    case VALUE_FORMAT_TYPES.STRING:
      return isString(value) ? value : '';

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      return successOrThrow(() => parseFloatLocale(value), `Erro ao processar o valor "${value}"`) as number;

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      return successOrThrow(() => parseFloatLocale(value), `Erro ao processar o valor "${value}"`) as number;

    case VALUE_FORMAT_TYPES.DATE_STRING:
      return successOrThrow(
        () => new CDate(value).getNative().valueOf(),
        `Erro ao processar o valor "${value}"`
      ) as number;

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      return successOrThrow(
        () => new CDate(value).getNative().valueOf(),
        `Erro ao processar o valor "${value}"`
      ) as number;

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      return successOrThrow(
        () => new CDate(CDate.stringToDate(value, locale)).getNative().valueOf(),
        `Erro ao processar o valor "${value}"`
      ) as number;

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      return successOrThrow(
        () =>
          Number(
            value
              .split(/[^\d]+/g)
              .filter((part) => part !== '')
              .reverse()
              .map((part) => (part.length < 2 ? `00${part}`.slice(-2) : part))
              .join('')
          ),
        `Erro ao processar o valor "${value}"`
      ) as number;

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      return successOrThrow(
        () => new CDate(CDate.stringToDate(value, locale)).getNative().valueOf(),
        `Erro ao processar o valor "${value}"`
      ) as number;

    case VALUE_FORMAT_TYPES.CURRENCY_STRING:
      return successOrThrow(() => parseFloatLocale(value), `Erro ao processar o valor "${value}"`) as number;

    case VALUE_FORMAT_TYPES.PERCENT_STRING:
      return successOrThrow(() => parseFloatLocale(value) / 100, `Erro ao processar o valor "${value}"`) as number;

    default:
      return 0;
  }
}
