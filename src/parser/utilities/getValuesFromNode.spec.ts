import { Tree } from '../tree';
import type { INode } from '../tree';
import getValuesFromNode from './getValuesFromNode';

const structure: INode<string, { text: '' }, { text: '' }> = {
  name: 'root',
  label: 'I am root',
  children: [
    {
      name: '1',
      label: 'I am Node of type 1',
      children: [
        {
          name: '2',
          label: 'I am Leaf 2',
          value: 'Hi from Leaf 2'
        },
        {
          name: '3',
          label: 'I am Leaf 3',
          value: 'Hi from Leaf 3'
        }
      ]
    },
    {
      name: '1',
      label: 'I am second Node of type 1',
      children: [
        {
          name: '2',
          label: 'I am Leaf 2',
          value: 'Hi from Leaf 2'
        },
        {
          name: '3',
          label: 'I am Leaf 3',
          value: 'Hi from Leaf 3'
        }
      ]
    },
    {
      name: '1',
      label: 'I am third Node of type 1',
      children: [
        {
          name: '2',
          label: 'I am Leaf 2',
          value: 'Hi from Leaf 2'
        },
        {
          name: '3',
          label: 'I am Leaf 3',
          value: 'Hi from Leaf 3'
        }
      ]
    },
    {
      name: '2',
      label: 'I am node 2',
      children: [
        {
          name: '3',
          label: 'I am node 3',
          children: [
            {
              name: '4',
              label: 'I am Leaf 4',
              value: 'Hi from Leaf 4'
            }
          ]
        },
        {
          name: '3',
          label: 'I am node 3',
          children: [
            {
              name: '4',
              label: 'I am Leaf 4',
              value: 'Hi from Leaf 4'
            }
          ]
        },
        {
          name: '3',
          label: 'I am node 3',
          children: [
            {
              name: '4',
              label: 'I am Leaf 4',
              value: 'Hi from Leaf 4'
            }
          ]
        }
      ]
    }
  ]
};

const tree = new Tree(structure);

describe('Testing getValuesFromNode...', () => {
  const nodes = tree.getNodesFromPath('1');
  const values = getValuesFromNode(nodes[0], ['2', '2.label', '']);
  const result = [
    {
      '2': 'Hi from Leaf 2',
      '2.label': 'I am Leaf 2'
    }
  ];
  const otherNodes = tree.getNodesFromPath('2');
  const otherValues = getValuesFromNode(otherNodes[0], ['3.4', '3.4.label', '']);
  const otherResult = [
    {
      '3.4': 'Hi from Leaf 4',
      '3.4.label': 'I am Leaf 4'
    },
    {
      '3.4': 'Hi from Leaf 4',
      '3.4.label': 'I am Leaf 4'
    },
    {
      '3.4': 'Hi from Leaf 4',
      '3.4.label': 'I am Leaf 4'
    }
  ];

  it('Should get right nodes from path', () => {
    expect(nodes.length).toBe(3);
    expect(otherNodes.length).toBe(1);
  });
  it('Should return array of objects having paths as keys', () => {
    expect(values).toEqual(result);
    expect(otherValues).toEqual(otherResult);
  });
});
