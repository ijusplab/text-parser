import { DataTable, DataValue, VALUE_FORMAT_TYPES } from '../types';
import getSortValue from './getSortValue';
import successOrNull from './successOrNull';
import { dateDiff, isDate, isNumber, DURATION_TYPES, range, CDate, toLocaleNumberFormat } from '@ijusplab/helpers';

type TF = string | number | Date | 'min';
type TT = string | number | Date | 'max' | 'today';

/**
 * Completes the given table by comparing the values in its first column to the given interval, filling in the gaps with empty rows whenever necessary.
 * Interval values must necessarily correspond to numbers (or dates as numbers).
 *
 * @param table The table to be expanded
 * @param format The format of the values
 * @param locale The locale used to format the value
 * @param from The parameter to use as the initial value of the interval
 * @param to The parameter to use as the final value of the interval
 */
export default function expandTable(
  table: DataTable,
  format: VALUE_FORMAT_TYPES,
  locale?: string,
  numberPrecision = 0,
  from: TF = 'min',
  to: TT = 'max'
): DataTable {
  const start = getStartValue(table, format, locale, from);
  const end = getEndValue(table, format, locale, to);

  switch (format) {
    case VALUE_FORMAT_TYPES.DATE:
      return expandWithDateInterval(table, new Date(start), new Date(end), DURATION_TYPES.DAYS).map((row) =>
        toOriginalFormat(row, format, locale)
      );

    case VALUE_FORMAT_TYPES.DATE_STRING:
      return expandWithDateInterval(table, new Date(start), new Date(end), DURATION_TYPES.DAYS).map((row) =>
        toOriginalFormat(row, format, locale)
      );

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      return expandWithDateInterval(table, new Date(start), new Date(end), DURATION_TYPES.DAYS).map((row) =>
        toOriginalFormat(row, format, locale)
      );

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      return expandWithDateInterval(table, new Date(start), new Date(end), DURATION_TYPES.DAYS).map((row) =>
        toOriginalFormat(row, format, locale)
      );

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      return expandWithDateInterval(table, new Date(start), new Date(end), DURATION_TYPES.DAYS).map((row) =>
        toOriginalFormat(row, format, locale)
      );

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE:
      return expandWithDateInterval(
        table,
        new CDate(new Date(start)).getCompetence(),
        new CDate(new Date(end)).getCompetence(),
        DURATION_TYPES.MONTHS
      ).map((row) => toOriginalFormat(row, format, locale));

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      return expandWithDateInterval(
        table,
        new CDate(new Date(start)).getCompetence(),
        new CDate(new Date(end)).getCompetence(),
        DURATION_TYPES.MONTHS
      ).map((row) => toOriginalFormat(row, format, locale));

    case VALUE_FORMAT_TYPES.NUMBER:
      return expandWithNumberInterval(table, start, end).map((row) => toOriginalFormat(row, format, locale));

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      return expandWithNumberInterval(table, start, end).map((row) =>
        toOriginalFormat(row, format, locale, numberPrecision)
      );

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      return expandWithNumberInterval(table, start, end).map((row) =>
        toOriginalFormat(row, format, locale, numberPrecision)
      );

    default:
      throw new Error(`O formato ${format} não pode ser utilizado para criar um intervalo!`);
  }
}

function toOriginalFormat(
  row: DataValue[],
  format: VALUE_FORMAT_TYPES,
  locale?: string,
  numberPrecision?: number
): DataValue[] {
  const value = row[0];
  if (!isNumber(value)) return row;

  switch (format) {
    case VALUE_FORMAT_TYPES.DATE:
      row[0] = successOrNull(() => new Date(value));
      break;

    case VALUE_FORMAT_TYPES.DATE_STRING:
      row[0] = successOrNull(() => new CDate(new Date(value)).toString());
      break;

    case VALUE_FORMAT_TYPES.DATE_ISO_STRING:
      row[0] = successOrNull(() => new CDate(new Date(value)).toISOString());
      break;

    case VALUE_FORMAT_TYPES.DATE_LOCALE_STRING:
      row[0] = successOrNull(() => new CDate(new Date(value)).toLocaleString());
      break;

    case VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING:
      row[0] = successOrNull(() => new CDate(new Date(value)).humanized());
      break;

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE:
      row[0] = successOrNull(() => new CDate(new Date(value)).getCompetence());
      break;

    case VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING:
      row[0] = successOrNull(() => new CDate(new Date(value)).getCompetenceAsString());
      break;

    case VALUE_FORMAT_TYPES.NUMBER_STRING:
      row[0] = successOrNull(() => value.toFixed(numberPrecision || 0));
      break;

    case VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING:
      row[0] = successOrNull(() => toLocaleNumberFormat(value, numberPrecision, locale));
      break;

    default:
      return row;
  }

  return row;
}

/**
 * Expands the table interpreting the start and end values as dates.
 *
 * @param table
 * @param startDate
 * @param endDate
 * @param durationType
 */
function expandWithDateInterval(
  table: DataTable,
  startDate: Date,
  endDate: Date,
  durationType: DURATION_TYPES = DURATION_TYPES.MONTHS
): DataTable {
  const colLength = table[0].length;
  const emptyRow = range(colLength - 1).map(() => null);

  const start = new CDate(startDate);
  const unities = dateDiff(startDate, endDate, durationType) + 1;

  const mapped = table
    .map((row, index) => (isNumber(row[0]) ? { index, value: new Date(row[0]) } : null))
    .filter((value) => value !== null) as { index: number; value: Date }[];

  if (table.length === 0) throw new Error(`Falha ao preencher as datas! (início: ${startDate}, max: ${endDate})`);

  const newTable = [] as DataTable;

  let row = 0;
  let current = 0;

  while (row < unities) {
    const date = start.add(row, durationType);
    let isSame = false;
    if (current < mapped.length) {
      const currentDate = mapped[current].value;
      isSame = isDate(currentDate) && date.sameAs(currentDate);
    }
    if (isSame) {
      const index = mapped[current].index;
      newTable.push(Array.prototype.concat(date.getNative().valueOf(), table[index].slice(1)));
      current++;
    } else {
      newTable.push(Array.prototype.concat(date.getNative().valueOf(), emptyRow));
    }
    row++;
  }

  return newTable;
}

/**
 * Expands the table interpreting the start and end values as integers.
 *
 * @param table
 * @param startValue
 * @param endValue
 */
function expandWithNumberInterval(table: DataTable, startValue: number, endValue: number): DataTable {
  const colLength = table[0].length;
  const emptyRow = range(colLength - 1).map(() => null);

  // Convert to integer
  startValue = Math.round(startValue);
  endValue = Math.round(endValue);

  const rows = endValue - startValue + 1;

  const mapped = table
    .map((row, index) => (isNumber(row[0]) ? { index, value: row[0] } : null))
    .filter((value) => value !== null) as { index: number; value: number }[];

  if (table.length === 0) throw new Error(`Falha ao preencher as datas! (min: ${startValue}, max: ${endValue})`);

  const newTable = [] as DataTable;

  let row = 0;
  let current = 0;

  while (row < rows) {
    const value = startValue + row;
    let isSame = false;
    if (current < mapped.length) {
      const currentValue = mapped[current].value;
      isSame = isDate(currentValue) && value === currentValue;
    }
    if (isSame) {
      const index = mapped[current].index;
      newTable.push(Array.prototype.concat(value, table[index].slice(1)));
      current++;
    } else {
      newTable.push(Array.prototype.concat(value, emptyRow));
    }
    row++;
  }

  return newTable;
}

/**
 * Gets the minimum value among the sorted values and the "from" value.
 *
 * @param table
 * @param format
 * @param locale
 * @param from
 */
function getStartValue(table: DataTable, format: VALUE_FORMAT_TYPES, locale?: string, from?: TF): number {
  const values = table.map((row) => row[0]).filter((value) => isNumber(value)) as number[];
  const min = Math.min(...values);

  if (values.length == 0) {
    console.log(table);
    console.log(min, from);
  }

  if (isNumber(from)) return Math.min(from, min);
  if (isDate(from)) return Math.min(from.valueOf(), min);
  if (!from || from === 'min') return min;

  const value = getSortValue(from, format, locale);

  if (isNumber(value)) return Math.min(value, min);
  return min;
}

/**
 * Gets the maximum value among the sorted values and the "to" value.
 *
 * @param table
 * @param format
 * @param locale
 * @param to
 */
function getEndValue(table: DataTable, format: VALUE_FORMAT_TYPES, locale?: string, to?: TT): number {
  const values = table.map((row) => row[0]).filter((value) => isNumber(value)) as number[];
  const max = Math.max(...values);

  if (isNumber(to)) return Math.max(to, max);
  if (isDate(to)) return Math.max(to.valueOf(), max);
  if (!to || to === 'max') return max;
  if (to === 'today') return Math.max(new Date().valueOf(), max);

  const value = getSortValue(to, format, locale);

  if (isNumber(value)) return Math.max(value, max);
  return max;
}
