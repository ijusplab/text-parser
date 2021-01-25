import type { DataValue } from '../types';

/**
 * Wrapper function to assure that `null` will be returned in case an exception is thrown
 *
 * @param callback
 */
export default function successOrNull(callback: () => DataValue): DataValue | null {
  try {
    return callback();
  } catch (e) {
    return null;
  }
}
