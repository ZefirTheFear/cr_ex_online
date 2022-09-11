import { useReducer, useCallback } from "react";
import { reducer, initFn } from "./testReducer";

const Test = () => {
  const [state, dispatch] = useReducer(reducer, { initialCount1: 5, initialCount2: 10 }, initFn);

  const decrease = useCallback(() => {
    dispatch({ type: "decrease" });
  }, []);

  const increase = useCallback(() => {
    dispatch({ type: "increase" });
  }, []);

  return (
    <div>
      <button type="button" onClick={decrease}>
        decrease
      </button>
      <span>{state.count}</span>
      <button type="button" onClick={increase}>
        increase
      </button>
    </div>
  );
};

export default Test;
