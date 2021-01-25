import type { ParseParameters } from '../types';
import type { VALUE_FORMAT_TYPES } from '../types';
import type { CURRENCY_CODES } from '@ijusplab/helpers';

/**
 * Gets the parse paremeters specified in the parse schema.
 * @param params
 */
export default function getParseOptions(
  params: ParseParameters
): {
  toType: VALUE_FORMAT_TYPES;
  locale?: string;
  currencyCode?: CURRENCY_CODES;
  numberPrecision?: number;
} {
  if (Array.isArray(params)) {
    return {
      toType: params[0],
      locale: params[1].locale,
      currencyCode: params[1].currencyCode,
      numberPrecision: params[1].numberPrecision
    };
  } else {
    return { toType: params };
  }
}
