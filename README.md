

# Tapecalc

A scientific calculator with a printed-paper-tape history, built around a **hand-written expression parser**. No `eval()`, no math libraries.

**[Live demo](https://YOUR-USERNAME.github.io/YOUR-REPO/)** ← CHANGE

![Tapecalc screenshot](docs/screenshot.png) ← CHANGE (add a screenshot or GIF)

## Features

- Correct operator precedence, parentheses, unary minus (`-2^2 = -4`) and right-associative powers (`2^3^2 = 512`)
- Scientific functions: `sin`, `cos`, `tan`, `ln`, `log`, `sqrt`, plus the constants `pi` and `e`
- Live result preview while you type
- Paper-tape history; click any line to reuse its result
- Clear error messages: divide by zero, mismatched parentheses, unknown functions, malformed input
- Full keyboard support (Enter to calculate, Esc to clear) and accessible controls (ARIA labels, visible focus states)
- Responsive layout that fits small phone screens
- 49 unit tests, run automatically on every push with GitHub Actions

## How it works

The calculator never uses `eval()`, which would let arbitrary code run. Instead, each input goes through three stages:

```
"2 + 3 * 4"  →  tokenize()  →  parse()  →  evaluateParsed()  →  14
                 text → tokens   tokens → RPN   RPN → number
```

1. **Tokenizer** (`src/engine/tokenizer.ts`): reads the text left to right and produces tokens (numbers, operators, brackets, function names). It rejects anything unexpected, with the character position.
2. **Parser** (`src/engine/parser.ts`): uses the **shunting-yard algorithm** to convert infix notation to Reverse Polish Notation. It handles precedence, associativity and unary minus, and validates the structure so inputs like `2 3`, `2 +` or `()` are rejected.
3. **Evaluator** (`src/engine/evaluate.ts`): computes the RPN result with a stack, guards against division by zero and non-finite results, and cleans up floating-point noise so `0.1 + 0.2` shows `0.3`.

**Safety:** only whitelisted functions and constants (`src/engine/functions.ts`) can be called. Lookups use a `Map`, so names like `constructor` can't reach JavaScript's prototype chain.

## Tech stack

TypeScript · Vite · Vitest · plain HTML/CSS (no UI framework) · GitHub Actions · GitHub Pages

## Run locally

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git   # ← CHANGE
cd YOUR-REPO
npm install
npm run dev      # start the dev server at http://localhost:5173
npm test         # run the unit tests
npm run build    # production build
```

## Project structure

```
src/
  engine/
    tokenizer.ts   text → tokens
    parser.ts      tokens → RPN (shunting-yard)
    evaluate.ts    RPN → number
    functions.ts   whitelist of functions and constants
    types.ts       Token type and CalcError
    index.ts       public API: evaluate("2+3*4")
  ui.ts            keypad, display, tape history
  style.css
tests/
  engine.test.ts   49 tests covering the engine
```

## What I learned

- Why `eval()` is dangerous, and how a tokenizer, parser and evaluator replace it
- How the shunting-yard algorithm handles precedence and associativity, and how a small state machine tells unary minus from binary minus
- Why floating-point arithmetic gives `0.1 + 0.2 = 0.30000000000000004`, and how to display it sensibly without corrupting large integers
- Writing tests for edge cases first and letting them guide the implementation
- Setting up CI so tests run on every push, and deploying automatically to GitHub Pages

## Known limitations / future work

- Trigonometric functions use radians (a DEG/RAD toggle is planned)
- Implicit multiplication like `2(3)` or `2pi` is rejected on purpose
- `tan(pi/2)` returns a very large number instead of "undefined", a floating-point limitation

## License

MIT