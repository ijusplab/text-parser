import { VALUE_FORMAT_TYPES } from '../types';
import getEndValue from './getEndValue';

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
      getEndValue(valueItems, targetKey, [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }], '01/06/2020')
    ).toEqual(new Date(2020, 5, 1).valueOf());
    expect(
      getEndValue(
        valueItems,
        targetKey,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        new Date(2020, 5, 1).valueOf()
      )
    ).toEqual(new Date(2020, 5, 1).valueOf());
    expect(
      getEndValue(
        valueItems,
        targetKey,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        new Date(2020, 5, 1)
      )
    ).toEqual(new Date(2020, 5, 1).valueOf());
    expect(
      getEndValue(valueItems, targetKey, [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }], 'max')
    ).toEqual(new Date(2012, 6, 1).valueOf());
    expect(
      getEndValue(valueItems, targetKey, [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }])
    ).toEqual(new Date(2012, 6, 1).valueOf());

    const valueOfToday = getEndValue(
      valueItems,
      targetKey,
      [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
      'today'
    );
    const today = new Date(valueOfToday);
    const todayParts = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    };
    const nowParts = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    };
    expect(todayParts).toEqual(nowParts);
  });
});
