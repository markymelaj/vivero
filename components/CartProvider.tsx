"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartMode } from "@/lib/cart-types";

// ─────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────

type State = {
  catalogo: CartItem[];
  mayorista: CartItem[];
};

type Action =
  | { type: "add"; mode: CartMode; item: CartItem }
  | { type: "remove"; mode: CartMode; id: string }
  | { type: "setQty"; mode: CartMode; id: string; quantity: number }
  | { type: "clear"; mode: CartMode }
  | { type: "hydrate"; state: State };

const STORAGE_KEY = "paesaggio_cart_v1";
const initial: State = { catalogo: [], mayorista: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const list = state[action.mode];
      const idx = list.findIndex((it) => it.id === action.item.id);
      const next = idx >= 0
        ? list.map((it, i) =>
            i === idx ? { ...it, quantity: it.quantity + action.item.quantity } : it
          )
        : [...list, action.item];
      return { ...state, [action.mode]: next };
    }
    case "remove":
      return {
        ...state,
        [action.mode]: state[action.mode].filter((it) => it.id !== action.id),
      };
    case "setQty":
      return {
        ...state,
        [action.mode]: state[action.mode]
          .map((it) =>
            it.id === action.id ? { ...it, quantity: Math.max(1, action.quantity) } : it
          ),
      };
    case "clear":
      return { ...state, [action.mode]: [] };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────

type CartContextValue = {
  state: State;
  add: (mode: CartMode, item: CartItem) => void;
  remove: (mode: CartMode, id: string) => void;
  setQty: (mode: CartMode, id: string, quantity: number) => void;
  clear: (mode: CartMode) => void;
  openDrawer: (mode: CartMode) => void;
  drawerMode: CartMode | null;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [drawerMode, setDrawerMode] = useState<CartMode | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        dispatch({ type: "hydrate", state: parsed });
      }
    } catch (_) {
      /* ignore */
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      add: (mode, item) => dispatch({ type: "add", mode, item }),
      remove: (mode, id) => dispatch({ type: "remove", mode, id }),
      setQty: (mode, id, quantity) => dispatch({ type: "setQty", mode, id, quantity }),
      clear: (mode) => dispatch({ type: "clear", mode }),
      openDrawer: (mode) => setDrawerMode(mode),
      drawerMode,
      closeDrawer: () => setDrawerMode(null),
    }),
    [state, drawerMode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
