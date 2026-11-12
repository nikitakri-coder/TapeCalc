

import { Token, BinaryOp, CalcError } from "./types";
import { FUNCTIONS, CONSTANTS } from "./functions";


const NUMBER = /\d+\.?\d*|\.\d+/y;
const IDENT = /[a-z_][a-z0-9_]*/iy;


const OPERATORS = new Map<string, BinaryOp>([
    ["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"], ["^", "^"],
    ["\u00D7", "*"],   // multiplicaation sign
    ["\u00F7", "/"],   // division sign
    ["\u2212", "-"],   // minus sign
]);


function matchAt(re: RegExp, text: string, index: number): string | null {
    re.lastIndex = index;
    const m = re.exec(text);
    return m ? m[0] : null;
}


const isSpace =(ch: string) => /\s/.test(ch);

export function tokenize(input: string): Token[]  {
    const tokens: Token[] = [];
    let i = 0;

    while (i < input.length) {
        const ch = input[i];

        if (isSpace(ch)) { i++; continue; }

        const num = matchAt(NUMBER, input, i);
        if (num !== null) {
            tokens.push({ type: "number", value: Number(num), pos: i });
            i += num.length;
            continue;
        }

        const ident = matchAt(IDENT, input, i);
        if (ident !== null) {
            const name = ident.toLowerCase();
            const end = i + ident.length;
            let j = end;
            while (j < input.length && isSpace(input[j])) j++;


            if (input[j] === "(") {
                if (!FUNCTIONS.has(name)) throw new CalcError(`Unknown function '${ident}'`, i);
                tokens.push({ type: "func", value: name, pos: i });
            } else if (CONSTANTS.has(name)) {
                tokens.push({ type: "number", value: CONSTANTS.get(name)!, pos: i });
            } else {
                throw new CalcError(`Unknown name '${ident}'`, i);
            }
            i = end;
            continue;
        }


        const op = OPERATORS.get(ch);
        if (op !== undefined) {
            tokens.push({ type: "op", value: op, pos: i });
            i++;
            continue;
        }


        if (ch === "(") { tokens.push({ type: "lparen", pos: i }); i++; continue; }
        if (ch === ")") { tokens.push({ type: "rparen", pos: i }); i++; continue; }

        throw new CalcError(`Unexpected character '${ch}'`, i);
    }
    
    return tokens;
}