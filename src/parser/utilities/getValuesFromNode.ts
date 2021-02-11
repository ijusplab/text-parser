import { range } from '@ijusplab/helpers';
import type { TOutputNode, TOutputValue } from '../types';

export default function getValuesFromNode(node: TOutputNode, paths: string[]): Record<string, TOutputValue>[] {
  const valueItems = paths.reduce((reduced, path) => {
    if (path) {
      const wantsLabel = path.split('.').slice(-1)[0] === 'label';
      const adjustedPath = wantsLabel ? path.split('.').slice(0, -1).join('.') : path;
      const fullPath = `${node.path}.${adjustedPath}`;
      reduced[path] = wantsLabel
        ? node.getAllLabelsFromPath(fullPath)
        : node.getValuesFromPath(fullPath).map((value) => value ?? null);
    }
    return reduced;
  }, {} as Record<string, TOutputValue[]>);
  const maxLength = paths.reduce((max, path) => (path ? Math.max(max, valueItems[path].length) : max), 0);
  return range(maxLength).map((index) => {
    return paths.reduce((reduced, path) => {
      if (path) reduced[path] = valueItems[path][index] ?? null;
      return reduced;
    }, {} as Record<string, TOutputValue>);
  });
}
