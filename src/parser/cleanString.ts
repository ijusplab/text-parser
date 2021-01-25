/**
 * Returns a string trimmed, without line breaks or extra spaces. This is to preprocess the value to be returned by `parseValue`.
 *
 * @param s The string to be cleaned
 */
export default function cleanString(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}
