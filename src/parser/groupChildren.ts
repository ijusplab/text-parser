import type { IParseNodeInfo, IDataNode, IDataLeaf } from '../types';
import { VALUE_MERGE_STRATEGY } from '../types';
import { isString, isNumber, isBoolean, isDate } from '@ijusplab/helpers';

/**
 * Post-processing of array of data values, in case any merge requirements should be observed.
 *
 * @param data An array of nodes/leaves to be merged
 * @param nodeParams The parsing parameters of the root node
 * @returns An array of data values, modified in accordance with the post-processing parameters.
 */
export default function groupChildren(dataNodes: IDataNode[], info: IParseNodeInfo): IDataNode[] {
  const { groupBy } = info;

  if (isString(groupBy)) {
    // Mapping unique values to groupBy
    const mapTable = getMapTable(dataNodes, groupBy);

    // Check if there is any key matching groupBy
    if (Object.keys(mapTable).length === 0) {
      throw new Error(`Unable to find values referenced by "${groupBy}"!`);
    }

    const unique = Object.keys(mapTable);
    const grouped = [] as IDataNode[];

    unique.forEach((key) => {
      grouped.push(merge(mapTable[key], info));
    });
    return grouped;
  }
  return dataNodes; // fallback
}

function getMapTable(nodes: IDataNode[], key: string): Record<string, IDataNode[]> {
  return nodes.reduce((map, node) => {
    const found = node.children.find((child) => child.name === key && 'value' in child);
    if (found && 'value' in found) {
      const value = getNodeValue(found);
      if (!map[value]) {
        map[value] = [];
      }
      map[value].push(node);
    }
    return map;
  }, {} as Record<string, IDataNode[]>);
}

function merge(dataNodes: IDataNode[], info: IParseNodeInfo): IDataNode {
  if (dataNodes.length === 1) return dataNodes[0];

  const toPreserve = getPreserveParams(info);

  // take the first node as base
  const base = dataNodes[0];
  // Creating base children outside base node,
  // so base chilndren remain intact for now
  const baseChildren = base.children.filter((child) => !toPreserve.map((item) => item.name).includes(child.name));

  // Gets all children to be preserved, group
  // them using preservation algorithm and
  // puts the result in base's children
  toPreserve.forEach((params) => {
    const name = params.name;
    const strategy = params.strategy;
    const children = dataNodes.reduce((toGo, node) => {
      node.children.forEach((child) => {
        if (child.name === name) {
          toGo.push(child);
        }
      });
      return toGo;
    }, [] as (IDataNode | IDataLeaf)[]);
    if (children.length > 0) {
      const isLeaf = children.every((child) => 'value' in child);
      // Only Leaves should have their values merged.
      // In case of Nodes, just need to preserve all of them
      if (isLeaf) {
        baseChildren.push(mergeValues(children as IDataLeaf[], strategy));
      } else {
        children.forEach((child) => baseChildren.push(child));
      }
    }
  });

  // Replace base's original children
  // with the new baseChildren
  base.children = baseChildren;
  return base;
}

function mergeValues(toBeMerged: IDataLeaf[], strategy?: VALUE_MERGE_STRATEGY): IDataLeaf {
  const paradigm = toBeMerged[0];
  try {
    switch (strategy) {
      case VALUE_MERGE_STRATEGY.SUM:
        return {
          name: paradigm.name,
          label: paradigm.label,
          value: getSum(toBeMerged as IDataLeaf[])
        };
      case VALUE_MERGE_STRATEGY.PRODUCT:
        return {
          name: paradigm.name,
          label: paradigm.label,
          value: getProduct(toBeMerged as IDataLeaf[])
        };
      case VALUE_MERGE_STRATEGY.MIN:
        return {
          name: paradigm.name,
          label: paradigm.label,
          value: getMin(toBeMerged as IDataLeaf[])
        };
      case VALUE_MERGE_STRATEGY.MAX:
        return {
          name: paradigm.name,
          label: paradigm.label,
          value: getMax(toBeMerged as IDataLeaf[])
        };
      default:
        return paradigm;
    }
  } catch (e) {
    console.log(toBeMerged);
    throw new Error(e.message);
  }
}

/**
 * Gets the value of a data node, provided it is a `string`, a `number` or a `Date`. Otherwise, throws an exception.
 *
 * @param node The data node
 * @returns The node value as `string` or `number`.
 */
function getNodeValue(dataLeaf: IDataLeaf): string | number {
  if (isString(dataLeaf.value) || isNumber(dataLeaf.value)) return dataLeaf.value as string | number;
  if (isDate(dataLeaf.value)) return dataLeaf.value.valueOf() as number;
  throw new Error('GroupBy is allowed only with string, number or date values!');
}

/**
 * Returns an array of objects with children names and merge strategies for children whose values should be preserved in the merge process.
 *
 * @param info IParseNodeInfo
 */
function getPreserveParams({
  preserve,
  mergeStrategy
}: IParseNodeInfo): { name: string; strategy: VALUE_MERGE_STRATEGY }[] {
  if (Array.isArray(preserve)) {
    return preserve.map((name, index) => {
      const strategy = getStrategy(mergeStrategy, index);
      return { name, strategy };
    });
  }

  if (isString(preserve)) {
    const name = preserve;
    const strategy = getStrategy(mergeStrategy, 0);
    return [{ name, strategy }];
  }

  return [];
}

/**
 * Returns a merge strategy in the position `index` if it is an array, the strategy itself if it is a single value, or a default value.
 * @param info IParseNodeInfo
 * @param index Index position to be used (for pairing with )
 */
function getStrategy(
  strategies: VALUE_MERGE_STRATEGY | VALUE_MERGE_STRATEGY[] | undefined,
  index: number
): VALUE_MERGE_STRATEGY {
  if (Array.isArray(strategies)) {
    return strategies[index] ?? strategies[strategies.length - 1];
  } else {
    return strategies ?? VALUE_MERGE_STRATEGY.SUM;
  }
}

/**
 * Gets the sum of values in all given nodes.
 * If values are of type `Date` or `string`, throws exception.
 *
 * @param nodes Nodes whose values should be summed up
 * @returns The sum value oe a concatenated string.
 */
function getSum(nodes: IDataLeaf[]): number | boolean {
  if (nodes.every((node) => isDate(node.value) || isString(node.value))) {
    throw new Error('Sum requires numbers or boolean values!');
  }
  if (nodes.every((node) => isNumber(node.value))) {
    return nodes.reduce((sum, node) => (sum += node.value as number), 0);
  }
  return nodes.some((node) => node.value === true);
}

/**
 * Gets the product of values in all given nodes.
 * If values are of type `Date` or `string`, throws exception.
 *
 * @param nodes Nodes whose values should be summed up
 * @returns The sum value oe a concatenated string.
 */
function getProduct(nodes: IDataLeaf[]): number | boolean {
  if (nodes.every((node) => isDate(node.value) || isString(node.value))) {
    throw new Error('Product requires numbers or boolean values!');
  }
  if (nodes.every((node) => isNumber(node.value))) {
    return nodes.reduce((sum, node) => (sum += node.value as number), 0);
  }
  return nodes.every((node) => node.value === true);
}

/**
 * Gets the minimum value of all given nodes.
 * In the case of strings, the values will be sorted alphabetically in ascending order and the first value will be returned.
 *
 * @param nodes Nodes to be considered
 * @returns The minimum value.
 */
function getMin(nodes: IDataLeaf[]): number | string | boolean | Date {
  if (nodes.every((node) => isBoolean(node.value))) {
    return getProduct(nodes);
  }
  if (nodes.every((node) => isNumber(node.value))) {
    return nodes.reduce((min, node) => Math.min(min, node.value as number), nodes[0].value as number);
  }
  if (nodes.every((node) => isDate(node.value))) {
    return nodes.reduce((min, node) => {
      const value = node.value as Date;
      return new Date(Math.min(min.valueOf(), value.valueOf()));
    }, nodes[0].value as Date);
  }
  const collator = new Intl.Collator();
  const sorted = nodes.sort((a, b) => {
    return collator.compare(a.value as string, b.value as string);
  });
  return sorted[0].value as string;
}

/**
 * Gets the maximum value of all given nodes.
 * In the case of strings, the values will be sorted alphabetically in descending order and the first value will be returned.
 *
 * @param nodes Nodes to be considered
 * @returns The minimum value.
 */
function getMax(nodes: IDataLeaf[]): number | string | boolean | Date {
  if (nodes.every((node) => isBoolean(node.value))) {
    return getSum(nodes);
  }
  if (nodes.every((node) => isNumber(node.value))) {
    return nodes.reduce((min, node) => Math.max(min, node.value as number), nodes[0].value as number);
  }
  if (nodes.every((node) => isDate(node.value))) {
    return nodes.reduce((min, node) => {
      const value = node.value as Date;
      return new Date(Math.max(min.valueOf(), value.valueOf()));
    }, nodes[0].value as Date);
  }
  const collator = new Intl.Collator();
  const sorted = nodes.sort((a, b) => {
    return collator.compare(b.value as string, a.value as string);
  });
  return sorted[0].value as string;
}
