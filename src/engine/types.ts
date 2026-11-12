
export type BinaryOp = "+" | "-" | "*" | "/" | "^";

export type Token = 
  | { type: "number"; value: number; pos: number }
  | { type: "op"; value: BinaryOp; pos: number }
  | { type: "func"; value: string; pos: number }
  | { type: "lparen"; pos: number }
  | { type: "rparen"; pos: number };

export class CalcError extends Error {
    constructor(message: string, public position?: number) {
        super(message);
        this.name = "CalcError";
    }
}

