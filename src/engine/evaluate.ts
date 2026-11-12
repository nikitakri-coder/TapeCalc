

import { Parsed } from "./parser";
import { CalcError } from "./types";
import { FUNCTIONS } from "./functions";

function check(n: number): number {
  if (!Number.isFinite(n)) throw new CalcError("Result is undefined or too large");
  return n;
}

function applyBinary(op: string, a: number, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/":
      if (b === 0) throw new CalcError("Cannot divide by zero");
      return a / b;
    case "^": return Math.pow(a, b);
    default: throw new CalcError(`Unknown operator '${op}'`);
  }
}

function cleanFloat(n: number): number {
  const cleaned = Number.isInteger(n) ? n : Number(n.toPrecision(15));
  return cleaned + 0;
}

export function evaluateParsed(rpn: Parsed): number {
  const stack: number[] = [];

  const pop = (): number => {
    const v = stack.pop();
    if (v === undefined) throw new CalcError("Invalid expression");
    return v;
  };

  for (const item of rpn) {
    if (item.type === "number") {
      stack.push(item.value);
    } else if (item.type === "func") {
      const fn = FUNCTIONS.get(item.value);
      if (!fn) throw new CalcError(`Unknown function '${item.value}'`);
      stack.push(check(fn(pop())));
    } else if (item.value === "neg") {
      stack.push(-pop());
    } else {
      const b = pop();
      const a = pop();
      stack.push(check(applyBinary(item.value, a, b)));
    }
  }

  if (stack.length !== 1) throw new CalcError("Invalid expression");
  return cleanFloat(stack[0]);
}