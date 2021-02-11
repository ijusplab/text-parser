import { VALUE_FORMAT_TYPES } from '../types';
import fillInNumbers from './fillInNumbers';

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

const filled = [
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': null,
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
    'salario.competencia': null,
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

const filledPlus = [
  {
    'salario.competencia': null,
    'salario.valor': 990
  },
  {
    'salario.competencia': null,
    'salario.valor': 991
  },
  {
    'salario.competencia': null,
    'salario.valor': 992
  },
  {
    'salario.competencia': null,
    'salario.valor': 993
  },
  {
    'salario.competencia': null,
    'salario.valor': 994
  },
  {
    'salario.competencia': null,
    'salario.valor': 995
  },
  {
    'salario.competencia': null,
    'salario.valor': 996
  },
  {
    'salario.competencia': null,
    'salario.valor': 997
  },
  {
    'salario.competencia': null,
    'salario.valor': 998
  },
  {
    'salario.competencia': null,
    'salario.valor': 999
  },
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': null,
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
    'salario.competencia': null,
    'salario.valor': 1004
  },
  {
    'salario.competencia': '01/06/2012',
    'salario.valor': 1005
  },
  {
    'salario.competencia': '01/07/2012',
    'salario.valor': 1006
  },
  {
    'salario.competencia': null,
    'salario.valor': 1007
  },
  {
    'salario.competencia': null,
    'salario.valor': 1008
  },
  {
    'salario.competencia': null,
    'salario.valor': 1009
  },
  {
    'salario.competencia': null,
    'salario.valor': 1010
  }
];

describe('Testing fillInNumber...', () => {
  it('Should fill in array correctly', () => {
    expect(fillInNumbers(valueItems, 'salario.valor', 1000, 1006, VALUE_FORMAT_TYPES.NUMBER)).toEqual(filled);
  });
  it('Should fill in array correctly up and down', () => {
    expect(fillInNumbers(valueItems, 'salario.valor', 990, 1010, VALUE_FORMAT_TYPES.NUMBER)).toEqual(filledPlus);
  });
});
