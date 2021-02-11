import type { ISortOptions } from '../types';

/**
 * Gets the orderBy paremeters specified in the datatable schema.
 * @param params
 */
export default function getSortOptions(
  params: string | [string, ISortOptions]
): {
  path: string;
  from?: string | number | Date | 'min';
  to?: string | number | Date | 'max' | 'today';
  fillIn?: boolean;
  desc?: boolean;
} {
  if (Array.isArray(params)) {
    return {
      path: params[0],
      from: params[1].from,
      to: params[1].to,
      fillIn: params[1].fillIn,
      desc: params[1].desc
    };
  } else {
    return { path: params };
  }
}
