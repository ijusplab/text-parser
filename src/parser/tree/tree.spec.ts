import Tree from './tree';
import type { INode } from './interfaces';

const structure: INode<string, undefined, undefined> = {
  name: 'root',
  label: 'I am root',
  children: [
    {
      name: '1',
      label: 'I am Node 1',
      children: [
        {
          name: '1',
          label: 'I am Leaf 1',
          value: 'Hi from Leaf 1'
        },
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
      label: 'I am Node 2',
      children: [
        {
          name: '4',
          label: 'I am Leaf 4',
          value: 'Hi from Leaf 4'
        },
        {
          name: '5',
          label: 'I am Leaf 5',
          value: 'Hi from Leaf 5'
        },
        {
          name: '6',
          label: 'I am Leaf 6',
          value: 'Hi from Leaf 6'
        },
        {
          name: '3',
          label: 'I am Node 3',
          children: [
            {
              name: '7',
              label: 'I am Leaf 7',
              value: 'Hi from Leaf 7'
            },
            {
              name: '8',
              label: 'I am Leaf 8',
              value: 'Hi from Leaf 8'
            }
          ]
        },
        {
          name: '3',
          label: 'I am Node 3',
          children: [
            {
              name: '9',
              label: 'I am Leaf 7',
              value: 'Hi from Leaf 7'
            },
            {
              name: '10',
              label: 'I am Leaf 8',
              value: 'Hi from Leaf 8'
            }
          ]
        }
      ]
    }
  ]
};

const compactTree: unknown = {
  root: {
    '1': {
      '1': 'Hi from Leaf 1',
      '2': 'Hi from Leaf 2',
      '3': 'Hi from Leaf 3'
    },
    '2': {
      '3': [
        {
          '7': 'Hi from Leaf 7',
          '8': 'Hi from Leaf 8'
        },
        {
          '9': 'Hi from Leaf 7',
          '10': 'Hi from Leaf 8'
        }
      ],
      '4': 'Hi from Leaf 4',
      '5': 'Hi from Leaf 5',
      '6': 'Hi from Leaf 6'
    }
  }
};

const tree = new Tree(structure);

const jsonString = `{
    "root": {
        "path": "",
        "name": "root",
        "label": "I am root",
        "children": [
            {
                "path": "1",
                "name": "1",
                "label": "I am Node 1",
                "children": [
                    {
                        "path": "1.1",
                        "name": "1",
                        "label": "I am Leaf 1",
                        "value": "Hi from Leaf 1"
                    },
                    {
                        "path": "1.2",
                        "name": "2",
                        "label": "I am Leaf 2",
                        "value": "Hi from Leaf 2"
                    },
                    {
                        "path": "1.3",
                        "name": "3",
                        "label": "I am Leaf 3",
                        "value": "Hi from Leaf 3"
                    }
                ]
            },
            {
                "path": "2",
                "name": "2",
                "label": "I am Node 2",
                "children": [
                    {
                        "path": "2.4",
                        "name": "4",
                        "label": "I am Leaf 4",
                        "value": "Hi from Leaf 4"
                    },
                    {
                        "path": "2.5",
                        "name": "5",
                        "label": "I am Leaf 5",
                        "value": "Hi from Leaf 5"
                    },
                    {
                        "path": "2.6",
                        "name": "6",
                        "label": "I am Leaf 6",
                        "value": "Hi from Leaf 6"
                    },
                    {
                        "path": "2.3",
                        "name": "3",
                        "label": "I am Node 3",
                        "children": [
                            {
                                "path": "2.3.7",
                                "name": "7",
                                "label": "I am Leaf 7",
                                "value": "Hi from Leaf 7"
                            },
                            {
                                "path": "2.3.8",
                                "name": "8",
                                "label": "I am Leaf 8",
                                "value": "Hi from Leaf 8"
                            }
                        ]
                    },
                    {
                        "path": "2.3",
                        "name": "3",
                        "label": "I am Node 3",
                        "children": [
                            {
                                "path": "2.3.9",
                                "name": "9",
                                "label": "I am Leaf 7",
                                "value": "Hi from Leaf 7"
                            },
                            {
                                "path": "2.3.10",
                                "name": "10",
                                "label": "I am Leaf 8",
                                "value": "Hi from Leaf 8"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}`;

describe('Testing tree...', () => {
  it('Should have all right properties', () => {
    expect(tree.root.label).toBe('I am root');
    expect(tree.root.name).toBe('root');
    expect(tree.root.path).toBe('');
  });
  it('Should get root', () => {
    const names = tree.getFromPath('').map((node) => node.name);
    expect(names).toEqual(['root']);
  });
  it('Should get all nodes from root', () => {
    const names = tree.getAllNodesFromPath('').map((node) => node.name);
    expect(names).toEqual(['root', '1', '2', '3', '3']);
  });
  it('Should get all leaves from root', () => {
    const names = tree.getAllLeavesFromPath('').map((leaf) => leaf.name);
    expect(names).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });
  it('Should get all values from root', () => {
    const names = tree.getAllValuesFromPath('');
    expect(names).toEqual([
      'Hi from Leaf 1',
      'Hi from Leaf 2',
      'Hi from Leaf 3',
      'Hi from Leaf 4',
      'Hi from Leaf 5',
      'Hi from Leaf 6',
      'Hi from Leaf 7',
      'Hi from Leaf 8',
      'Hi from Leaf 7',
      'Hi from Leaf 8'
    ]);
  });
  it('Should get leaves right under Node 1', () => {
    const node = tree.getNodesFromPath('1')[0];
    const names = node.getMyLeaves().map((leaf) => leaf.name);
    expect(names).toEqual(['1', '2', '3']);
  });
  it('Should get values from Node 1', () => {
    const node = tree.getNodesFromPath('1')[0];
    const values = node.getMyLeaves().map((leaf) => leaf.value);
    expect(values).toEqual(['Hi from Leaf 1', 'Hi from Leaf 2', 'Hi from Leaf 3']);
  });
  it('Should iterate deep paths', () => {
    expect(tree.getValuesFromPath('2.3.8')).toEqual(['Hi from Leaf 8']);
    expect(tree.getValuesFromPath('2.5')).toEqual(['Hi from Leaf 5']);
  });
  it('Should return empty array if path does not exist', () => {
    expect(tree.getValuesFromPath('2.3.11')).toEqual([]);
  });
  it('Should correctly execute toCompactObject', () => {
    expect(tree.toCompactObject()).toEqual(compactTree);
  });
  it('Should correctly execute toString method', () => {
    expect(tree.toString()).toBe(jsonString);
  });
});
