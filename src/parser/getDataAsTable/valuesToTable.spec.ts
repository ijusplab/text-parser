import valuesToTable from './valuesToTable';

const valueItems = [
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

const table = [
  ['01/01/2012', 1000],
  ['01/02/2012', 1001],
  ['01/03/2012', 1002],
  ['01/04/2012', 1003],
  ['01/05/2012', 1004],
  ['01/06/2012', 1005],
  ['01/07/2012', 1006]
];

describe('Testing valuesToTable...', () => {
  it('Should fill in values correctly, in the given format', () => {
    expect(valuesToTable(valueItems, [['salario.competencia', 'salario.valor']])).toEqual(table);
  });
  it('Should return empty table, but in the right format, in case there are no value items', () => {
    expect(valuesToTable([], [['salario.competencia', 'salario.valor']])).toEqual([[null, null]]);
  });
});
