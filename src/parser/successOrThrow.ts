import type { DataValue } from '../types';

/**
 * Wrapper function to assure that `null` will be returned in case an exception is thrown
 *
 * @param callback
 */
export default function successOrThrow(callback: () => DataValue, errorMessage: string): DataValue {
  try {
    return callback();
  } catch (e) {
    throw new Error(errorMessage);
  }
}
