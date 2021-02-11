import { VALUE_FORMAT_TYPES } from '../types';
import getSortValue from './getSortValue';

describe('Testing getSortValue...', () => {
  it('Should yield correct values for every kind of parameter', () => {
    expect(getSortValue(null, [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(null);
    expect(getSortValue(undefined, [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(null);
    expect(getSortValue('', [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(null);
    expect(getSortValue(new Date(2020, 0, 1), [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(
      new Date(2020, 0, 1).valueOf()
    );
    expect(getSortValue(true, [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(1);
    expect(getSortValue(false, [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe(0);
    expect(getSortValue(99.5, [VALUE_FORMAT_TYPES.PERCENT, { locale: 'pt-BR' }])).toBe(0.995);
    expect(getSortValue('foo', [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe('foo');
    expect(getSortValue(2, [VALUE_FORMAT_TYPES.STRING, { locale: 'pt-BR' }])).toBe('2');
    expect(getSortValue('2,56', [VALUE_FORMAT_TYPES.NUMBER_STRING, { locale: 'pt-BR' }])).toBe(2.56);
    expect(getSortValue('1.002,56', [VALUE_FORMAT_TYPES.NUMBER_LOCALE_STRING, { locale: 'pt-BR' }])).toBe(1002.56);
    expect(getSortValue('2020-01-01', [VALUE_FORMAT_TYPES.DATE_STRING, { locale: 'pt-BR' }])).toBe(
      new Date(2020, 0, 1).valueOf()
    );
    expect(getSortValue('2020-01-01T00:00:00.000Z', [VALUE_FORMAT_TYPES.DATE_ISO_STRING, { locale: 'pt-BR' }])).toBe(
      new Date(Date.UTC(2020, 0, 1)).valueOf()
    );
    expect(getSortValue('01/01/2020', [VALUE_FORMAT_TYPES.DATE_LOCALE_STRING, { locale: 'pt-BR' }])).toBe(
      new Date(2020, 0, 1).valueOf()
    );
    expect(getSortValue('1 de janeiro de 2020', [VALUE_FORMAT_TYPES.DATE_HUMANIZED_STRING, { locale: 'pt-BR' }])).toBe(
      202001
    );
    expect(getSortValue('01/01/2020', [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }])).toBe(
      new Date(2020, 0, 1).valueOf()
    );
    expect(getSortValue('R$ 1.000,56', [VALUE_FORMAT_TYPES.CURRENCY_STRING, { locale: 'pt-BR' }])).toBe(1000.56);
    expect(getSortValue('96,5%', [VALUE_FORMAT_TYPES.PERCENT_STRING, { locale: 'pt-BR' }])).toBe(0.965);
  });
});
