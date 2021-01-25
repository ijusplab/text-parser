import type { ISortOptions } from '../types';

/**
 * Gets the orderBy paremeters specified in the datatable schema.
 * @param params
 */
export default function getSortOptions(
  params: string | [string, ISortOptions]
): {
  orderByPath: string;
  from?: string | number | Date | 'min';
  to?: string | number | Date | 'max' | 'today';
  expand?: boolean;
  desc?: boolean;
} {
  if (Array.isArray(params)) {
    return {
      orderByPath: params[0],
      from: params[1].from,
      to: params[1].to,
      expand: params[1].expand,
      desc: params[1].desc
    };
  } else {
    return { orderByPath: params };
  }
}
