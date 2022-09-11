// import { Currency } from "../../models/currency";

// type Percentage = {
//   amountFrom: number;
//   amountTo: number;
//   percentBuyCrypto: number;
//   percentSaleCrypto: number;
// };

interface CalculatorState {
  // currentCurrencyFromCustomer: Currency,
  // currentCurrencyToCustomer: Currency;
  // amountCurrencyFromCustomer: number;
  // amountCurrencyToCustomer: number;
  // percentageTable: Percentage[];
  // lastModifiedField: "FROM" | "TO";
  count: number;
}

export const initFn = (obj: { initialCount1: number; initialCount2: number }) => {
  return { count: obj.initialCount1 + obj.initialCount2 };
};

export const reducer = (state: CalculatorState, action: { type: "increase" | "decrease" }) => {
  switch (action.type) {
    case "increase":
      return {
        ...state,
        count: state.count + 1
      };

    case "decrease":
      return {
        ...state,
        count: state.count - 1
      };

    default:
      return state;
  }
};
