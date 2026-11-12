

import { Token, CalcError } from "./types";


type OpName = "+" | "-" | "*" | "/" | "^" | "neg";


export type RpnItem = 
  | { type: "number"; value: number }
  | { type: "op"; value: OpName }
  | { type: "func"; value: string }


export type Parsed = RpnItem[];


type StackItem = Extract<RpnItem, { type: "op" | "func" }> | { type: "lparen"; pos: number };


const PRECEDENCE: Record<OpName, number> = { "+": 1, "-": 1, "*": 2, "/": 2, neg: 3, "^": 4 };
const RIGHT_ASSOCIATIVE = new Set<OpName>(["^"]);


export function parse(tokens: Token[]): Parsed {
  if (tokens.length === 0) throw new CalcError("Enter an expression");

  const output: RpnItem[] = [];
  const stack: StackItem[] = [];
  let expectOperand = true;

  for (const tok of tokens) {
    switch (tok.type) {

        case "number":
            if (!expectOperand) throw new CalcError("Missing operator before number", tok.pos);
            output.push({ type: "number", value: tok.value });
            expectOperand = false;
            break;


        case "func":
            if (!expectOperand) throw new CalcError("Missing operator before function", tok.pos);
            stack.push({ type: "func", value: tok.value });
            break;


        case "lparen":
            if (!expectOperand) throw new CalcError("Missing operator before '('", tok.pos);
            stack.push({ type: "lparen", pos: tok.pos });
            break;


        case "rparen": {
            if (expectOperand) throw new CalcError("Unexpected ')'", tok.pos);
            let foundOpen = false;
            while (stack.length > 0) {
                const top = stack.pop()!;
                if (top.type === "lparen") { foundOpen = true; break; }
                output.push(top);
        }

        if (!foundOpen) throw new CalcError("Mismatched parentheses", tok.pos);
        const below = stack[stack.length - 1];
        if (below && below.type === "func") output.push(stack.pop() as RpnItem);
        expectOperand = false;
        break;
    }


    case "op":
        if (expectOperand) {
          if (tok.value === "-") stack.push({ type: "op", value: "neg" });
          else if (tok.value !== "+") throw new CalcError(`Unexpected operator '${tok.value}'`, tok.pos);
        } else {
          while (stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.type !== "op") break;
            const higher = PRECEDENCE[top.value] > PRECEDENCE[tok.value];
            const equalLeft =
              PRECEDENCE[top.value] === PRECEDENCE[tok.value] && !RIGHT_ASSOCIATIVE.has(tok.value);
            if (!(higher || equalLeft)) break;
            output.push(stack.pop() as RpnItem);
          }
          stack.push({ type: "op", value: tok.value });
          expectOperand = true;
        }
        break;
    }
  }

if (expectOperand) throw new CalcError("Expression ends unexpectedly");

  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.type === "lparen") throw new CalcError("Mismatched parentheses", top.pos);
    output.push(top);
  }
  return output;
}
