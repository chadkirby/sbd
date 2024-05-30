// lib/tokenizer.d.ts

/**
 * Options for the sentence tokenizer.
 */
export interface SentencesOptions {
  preserve_whitespace?: boolean;
  abbreviations?: string[];
}

/**
* Split the entry into sentences.
*
* @param text - The text to split into sentences
* @param user_options - Options for the sentence tokenizer
* @return An array of sentences
*/
export function sentences(text: string, user_options?: SentencesOptions): string[];
