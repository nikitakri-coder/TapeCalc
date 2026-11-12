

import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { evaluateParsed } from "./evaluate";

export { CalcError } from "./types";

/** Public API: evaluate("2 + 3 * 4") -> 14. Never uses eval(). */
export function evaluate(input: string): number {
  return evaluateParsed(parse(tokenize(input)));
}