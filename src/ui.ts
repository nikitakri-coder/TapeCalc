

import { evaluate, CalcError } from "./engine";

const KEYS: { label: string; key: string; kind?: "op" | "action" | "equals" }[] = [
  { label: "C", key: "clear", kind: "action" },
  { label: "(", key: "(" },
  { label: ")", key: ")" },
  { label: "\u00F7", key: "/", kind: "op" },
  { label: "7", key: "7" }, { label: "8", key: "8" }, { label: "9", key: "9" },
  { label: "\u00D7", key: "*", kind: "op" },
  { label: "4", key: "4" }, { label: "5", key: "5" }, { label: "6", key: "6" },
  { label: "\u2212", key: "-", kind: "op" },
  { label: "1", key: "1" }, { label: "2", key: "2" }, { label: "3", key: "3" },
  { label: "+", key: "+", kind: "op" },
  { label: "0", key: "0" }, { label: ".", key: "." },
  { label: "\u232B", key: "back", kind: "action" },
  { label: "=", key: "equals", kind: "equals" },
];

const SCI: { label: string; insert: string }[] = [
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "ln", insert: "ln(" },
  { label: "log", insert: "log(" },
  { label: "\u221A", insert: "sqrt(" },
  { label: "\u03C0", insert: "pi" },
  { label: "^", insert: "^" },
];

export function mountCalculator() {
  const expr = document.querySelector<HTMLInputElement>("#expr")!;
  const result = document.querySelector<HTMLOutputElement>("#result")!;
  const keys = document.querySelector<HTMLElement>("#keys")!;
  const sci = document.querySelector<HTMLElement>("#sci")!;
  const history = document.querySelector<HTMLOListElement>("#history")!;
  const empty = document.querySelector<HTMLElement>("#tape-empty")!;

  // build the main keypad
  for (const k of KEYS) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = k.label;
    b.dataset.key = k.key;
    b.className = `key ${k.kind ?? ""}`;
    b.setAttribute("aria-label", k.label);
    keys.appendChild(b);
  }

  // build the scientific row
  for (const f of SCI) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = f.label;
    b.dataset.insert = f.insert;
    b.className = "key fn";
    b.setAttribute("aria-label", f.label);
    sci.appendChild(b);
  }

  const showError = (msg: string) => { result.textContent = msg; result.classList.add("error"); };
  const clearError = () => { result.classList.remove("error"); };

  function calculate() {
    const text = expr.value.trim();
    if (!text) return;
    try {
      const value = evaluate(text);
      addToTape(text, String(value));
      expr.value = String(value);
      result.textContent = "";
      clearError();
    } catch (e) {
      showError(e instanceof CalcError ? e.message : "Something went wrong");
    }
  }

  function addToTape(input: string, output: string) {
    empty.hidden = true;
    const li = document.createElement("li");
    li.innerHTML = `<span class="t-expr"></span><span class="t-res"></span>`;
    li.querySelector(".t-expr")!.textContent = input;
    li.querySelector(".t-res")!.textContent = output;
    li.addEventListener("click", () => { expr.value = output; expr.focus(); });
    history.appendChild(li);
    li.scrollIntoView({ block: "end" });
  }

  function press(key: string) {
    clearError();
    if (key === "clear") { expr.value = ""; result.textContent = ""; }
    else if (key === "back") expr.value = expr.value.slice(0, -1);
    else if (key === "equals") calculate();
    else expr.value += key;
    if (key !== "equals") {
      try { result.textContent = expr.value ? String(evaluate(expr.value)) : ""; }
      catch { result.textContent = ""; }
    }
  }

  keys.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (btn?.dataset.key) press(btn.dataset.key);
  });

  sci.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (btn?.dataset.insert) { press(btn.dataset.insert); expr.focus(); }
  });

  expr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); calculate(); }
    if (e.key === "Escape") press("clear");
  });
  expr.addEventListener("input", () => press(""));
  expr.focus();
}