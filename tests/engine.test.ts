

import { describe, it, expect } from "vitest";
import { evaluate, CalcError } from "../src/engine";

describe("basic arithmetic", () => {
  it("adds", () => expect(evaluate("2 + 3")).toBe(5));
  it("subtracts", () => expect(evaluate("10 - 4")).toBe(6));
  it("multiplies", () => expect(evaluate("6 * 7")).toBe(42));
  it("divides", () => expect(evaluate("8 / 2")).toBe(4));
  it("handles decimals", () => expect(evaluate("1.5 + 2.25")).toBe(3.75));
  it("handles leading dot", () => expect(evaluate(".5 + .5")).toBe(1));
});

describe("precedence and associativity", () => {
  it("* before +", () => expect(evaluate("2 + 3 * 4")).toBe(14));
  it("left-assoc subtraction", () => expect(evaluate("10 - 3 - 2")).toBe(5));
  it("left-assoc division", () => expect(evaluate("100 / 10 / 2")).toBe(5));
  it("^ is right-assoc", () => expect(evaluate("2 ^ 3 ^ 2")).toBe(512));
  it("^ before *", () => expect(evaluate("2 * 3 ^ 2")).toBe(18));
});

describe("parentheses", () => {
  it("overrides precedence", () => expect(evaluate("(2 + 3) * 4")).toBe(20));
  it("nested", () => expect(evaluate("((1 + 2) * (3 + 4))")).toBe(21));
  it("throws on unclosed", () => expect(() => evaluate("(1 + 2")).toThrow(CalcError));
  it("throws on extra close", () => expect(() => evaluate("1 + 2)")).toThrow(CalcError));
});

describe("unary minus", () => {
  it("leading", () => expect(evaluate("-3 + 5")).toBe(2));
  it("after operator", () => expect(evaluate("2 * -4")).toBe(-8));
  it("before parens", () => expect(evaluate("-(1 + 2)")).toBe(-3));
  it("double negative", () => expect(evaluate("--3")).toBe(3));
});

describe("errors and edge cases", () => {
  it("divide by zero", () => expect(() => evaluate("1 / 0")).toThrow(/zero/i));
  it("empty input", () => expect(() => evaluate("")).toThrow(CalcError));
  it("dangling operator", () => expect(() => evaluate("2 +")).toThrow(CalcError));
  it("two numbers in a row", () => expect(() => evaluate("2 3")).toThrow(CalcError));
  it("unknown character", () => expect(() => evaluate("2 $ 3")).toThrow(CalcError));
  it("float noise fixed", () => expect(evaluate("0.1 + 0.2")).toBe(0.3));
  it("never runs JS", () => expect(() => evaluate("alert(1)")).toThrow(CalcError));
});

describe("functions and constants", () => {
  it("sqrt", () => expect(evaluate("sqrt(16)")).toBe(4));
  it("nested functions", () => expect(evaluate("sqrt(abs(-9))")).toBe(3));
  it("function in expression", () => expect(evaluate("2 * sqrt(9) + 1")).toBe(7));
  it("log base 10", () => expect(evaluate("log(1000)")).toBe(3));
  it("ln e", () => expect(evaluate("ln(e)")).toBe(1));
  it("sin(pi) is 0", () => expect(evaluate("sin(pi)")).toBe(0));
  it("cos(0)", () => expect(evaluate("cos(0)")).toBe(1));
  it("pi", () => expect(evaluate("pi")).toBeCloseTo(3.14159265, 7));
  it("sqrt of negative", () => expect(() => evaluate("sqrt(-1)")).toThrow(CalcError));
  it("unknown function", () => expect(() => evaluate("foo(1)")).toThrow(/unknown function/i));
  it("prototype names blocked", () => expect(() => evaluate("constructor(1)")).toThrow(CalcError));
  it("empty call", () => expect(() => evaluate("sqrt()")).toThrow(CalcError));
  it("sin(pi/2)", () => expect(evaluate("sin(pi/2)")).toBe(1));
  it("cos(pi)", () => expect(evaluate("cos(pi)")).toBe(-1));
  it("tan(pi/4)", () => expect(evaluate("tan(pi/4)")).toBe(1));
  it("sin in degrees", () => expect(evaluate("sin(30*pi/180)")).toBe(0.5));
});

describe("more edge cases", () => {
  it("-2^2 is -4", () => expect(evaluate("-2 ^ 2")).toBe(-4));
  it("2^-1", () => expect(evaluate("2 ^ -1")).toBe(0.5));
  it("unary plus", () => expect(evaluate("+3 + 2")).toBe(5));
  it("UI symbols", () => expect(evaluate("6 × 7 ÷ 2 − 1")).toBe(20));
  it("no -0", () => expect(evaluate("0 * -1")).toBe(0));
  it("big integers stay exact", () => expect(evaluate("2 ^ 53")).toBe(9007199254740992));
  it("implicit multiplication rejected", () => expect(() => evaluate("2(3)")).toThrow(CalcError));
  it("empty parentheses", () => expect(() => evaluate("()")).toThrow(CalcError));
  it("operator first", () => expect(() => evaluate("* 3")).toThrow(CalcError));
  it("overflow", () => expect(() => evaluate("10 ^ 1000")).toThrow(CalcError));
  it("whitespace only", () => expect(() => evaluate("   ")).toThrow(CalcError));
});