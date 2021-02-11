import type { TOutputValue } from '../types';

/**
 * Wrapper function to assure that `null` will be returned in case an exception is thrown
 *
 * @param callback
 */
export default function successOrThrow(callback: () => TOutputValue, errorMessage: string): TOutputValue {
  try {
    return callback();
  } catch (e) {
    throw new Error(errorMessage);
  }
}
