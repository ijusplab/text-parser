import type { DataValue } from '../types';
import { VALUE_FORMAT_TYPES } from '../types';
import successOrThrow from './successOrThrow';
import { isNumber, isDate, CDate, parseFloatLocale, isBoolean } from '@ijusplab/helpers';

/**
 * Convertes parsed DataValue to its numeric equivalent.
 *
 * @param value The DataValue
 * @param parseParams The parameters informing how the value was parsed
 * @returns The number equivalent or the value itself, if parsed as string.
 */
export default function getSortValue(
  value: DataValue,
  format: VALUE_FORMAT_TYPES,
  locale?: string
): number | string | null {
  if (value === null || value === undefined || value === '') return null;
  if (isDate(value)) return value.valueOf();
  if (isBoolean(value)) return Number(value);

  if (isNumber(value)) {
    return format === VALUE_FORMAT_TYPES.PERCENT ? value / 100 : value;
  }

  switch (format) {
    case VALUE_FORMAT_TYPES.STRING:
      return value;

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
      return successOrThrow(() => parseFloatLocale(value), `Erro ao processar o valor "${value}"`) as number;

    default:
      return 0;
  }
}
