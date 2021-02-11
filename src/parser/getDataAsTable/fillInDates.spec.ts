import { DURATION_TYPES } from '@ijusplab/helpers';
import { VALUE_FORMAT_TYPES } from '../types';
import fillInDates from './fillInDates';

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
    'salario.competencia': '01/02/2012',
    'salario.valor': null
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
    'salario.valor': null
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
    'salario.competencia': '01/01/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/02/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/03/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/04/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/05/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/06/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/07/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/08/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/09/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/10/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/11/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/12/2011',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/01/2012',
    'salario.valor': 1000
  },
  {
    'salario.competencia': '01/02/2012',
    'salario.valor': null
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
    'salario.valor': null
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
    'salario.competencia': '01/08/2012',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/09/2012',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/10/2012',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/11/2012',
    'salario.valor': null
  },
  {
    'salario.competencia': '01/12/2012',
    'salario.valor': null
  }
];

describe('Testing fillInDates...', () => {
  it('Should fill in array correctly', () => {
    expect(
      fillInDates(
        valueItems,
        'salario.competencia',
        new Date(2012, 0, 1),
        new Date(2012, 6, 1),
        DURATION_TYPES.MONTHS,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }]
      )
    ).toEqual(filled);
  });
  it('Should fill in array correctly up and down', () => {
    expect(
      fillInDates(
        valueItems,
        'salario.competencia',
        new Date(2011, 0, 1),
        new Date(2012, 11, 1),
        DURATION_TYPES.MONTHS,
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }]
      )
    ).toEqual(filledPlus);
  });
});
