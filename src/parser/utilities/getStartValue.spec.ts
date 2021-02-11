import { VALUE_FORMAT_TYPES } from '../types';
import getStartValue from './getStartValue';

const valueItems = [
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': '01/03/2012',
    'salario.valor': 1002
  },
  {
    'salario.competencia': '01/04/2012',
    'salario.valor': 1003
  },
  {
    'salario.competencia': '01/06/2012',
    'salario.valor': 1005
  },
  {
    'salario.competencia': '01/07/2012',
    'salario.valor': 1006
  }
];

describe('Testing getStartValue...', () => {
  it('Should yield correct results for every kind of parameter', () => {
    const targetKey = 'salario.competencia';
    expect(
      getStartValue(
        valueItems,
        targetKey,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        '01/01/2020'
      )
    ).toEqual(new Date(2020, 0, 1).valueOf());
    expect(
      getStartValue(
        valueItems,
        targetKey,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        new Date(2020, 0, 1).valueOf()
      )
    ).toEqual(new Date(2020, 0, 1).valueOf());
    expect(
      getStartValue(
        valueItems,
        targetKey,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        new Date(2020, 0, 1)
      )
    ).toEqual(new Date(2020, 0, 1).valueOf());
    expect(
      getStartValue(valueItems, targetKey, [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }], 'min')
    ).toEqual(new Date(2012, 0, 1).valueOf());
    expect(
      getStartValue(valueItems, targetKey, [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }])
    ).toEqual(new Date(2012, 0, 1).valueOf());
  });
});
