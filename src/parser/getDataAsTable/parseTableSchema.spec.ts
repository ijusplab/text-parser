import { VALUE_FORMAT_TYPES } from '../types';
import sortValues from './sortValues';

const valueItems = [
  {
    'salario.competencia': '01/07/2012',
    'salario.valor': 1006
  },
  {
    'salario.competencia': '01/03/2012',
    'salario.valor': 1002
  },
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': '01/02/2012',
    'salario.valor': 1001
  },
  {
    'salario.competencia': '01/05/2012',
    'salario.valor': 1004
  },
  {
    'salario.competencia': '01/04/2012',
    'salario.valor': 1003
  },
  {
    'salario.competencia': '01/06/2012',
    'salario.valor': 1005
  }
];

const sorted = [
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': '01/02/2012',
    'salario.valor': 1001
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
    'salario.competencia': '01/05/2012',
    'salario.valor': 1004
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

describe('Testing sortValues...', () => {
  it('Should sort values correctly', () => {
    expect(
      sortValues(valueItems, 'salario.competencia', false, [
        VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING,
        { locale: 'pt-BR' }
      ])
    ).toEqual(sorted);
  });
});
