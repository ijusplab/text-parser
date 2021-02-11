import { VALUE_FORMAT_TYPES } from '../types';
import fillInValues from './fillInValues';

const dateValueItems = [
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

const dateValuesFilled = [
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

const dateValuesFilledPlus = [
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

describe('Testing fillInValues...', () => {
  it('Should fill in array correctly', () => {
    expect(
      fillInValues(dateValueItems, 'salario.competencia', [
        VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING,
        { locale: 'pt-BR' }
      ])
    ).toEqual(dateValuesFilled);
  });
  it('Should fill in array correctly up and down', () => {
    expect(
      fillInValues(
        dateValueItems,
        'salario.competencia',
        [VALUE_FORMAT_TYPES.DATE_COMPETENCE_STRING, { locale: 'pt-BR' }],
        '01/01/2011',
        '01/12/2012'
      )
    ).toEqual(dateValuesFilledPlus);
  });
});
