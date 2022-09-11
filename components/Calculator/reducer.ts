import { Currency } from "../../models/currency";

enum ActionType {
  SET_CURRENT_CURRENCY_FROM_CUSTOMER = "SET_CURRENT_CURRENCY_FROM_CUSTOMER",
  SET_CURRENT_CURRENCY_TO_CUSTOMER = "SET_CURRENT_CURRENCY_TO_CUSTOMER",
  SET_AMOUNT_CURRENCY_FROM_CUSTOMER = "SET_AMOUNT_CURRENCY_FROM_CUSTOMER",
  SET_AMOUNT_CURRENCY_TO_CUSTOMER = "SET_AMOUNT_CURRENCY_TO_CUSTOMER",
  SWAP_CURRENCIES = "SWAP_CURRENCIES",
  SET_PERCANTAGES = "SET_PERCANTAGES"
}

type Percentage = {
  amountFrom: number;
  amountTo: number;
  percentBuyCrypto: number;
  percentSaleCrypto: number;
};

interface SetCurrentCurrencyFromCustomerAction {
  type: ActionType.SET_CURRENT_CURRENCY_FROM_CUSTOMER;
  payload: {
    currency: Currency;
  };
}

interface SetCurrentCurrencyToCustomerAction {
  type: ActionType.SET_CURRENT_CURRENCY_TO_CUSTOMER;
  payload: {
    currency: Currency;
  };
}

interface SwapCurrenciesAction {
  type: ActionType.SWAP_CURRENCIES;
}

interface SetAmountCurrencyFromCustomerAction {
  type: ActionType.SET_AMOUNT_CURRENCY_FROM_CUSTOMER;
  payload: {
    amount: number;
  };
}

interface SetAmountCurrencyToCustomerAction {
  type: ActionType.SET_AMOUNT_CURRENCY_TO_CUSTOMER;
  payload: {
    amount: number;
  };
}

interface SetPercentagesAction {
  type: ActionType.SET_PERCANTAGES;
  payload: {
    percentages: Percentage[];
  };
}

type Actions =
  | SetCurrentCurrencyFromCustomerAction
  | SetCurrentCurrencyToCustomerAction
  | SwapCurrenciesAction
  | SetAmountCurrencyFromCustomerAction
  | SetAmountCurrencyToCustomerAction
  | SetPercentagesAction;

export const setCurrentCurrencyFromCustomer = (
  currency: Currency
): SetCurrentCurrencyFromCustomerAction => ({
  type: ActionType.SET_CURRENT_CURRENCY_FROM_CUSTOMER,
  payload: {
    currency
  }
});

export const setCurrentCurrencyToCustomer = (
  currency: Currency
): SetCurrentCurrencyToCustomerAction => ({
  type: ActionType.SET_CURRENT_CURRENCY_TO_CUSTOMER,
  payload: {
    currency
  }
});

interface CalculatorState {
  currentCurrencyFromCustomer: Currency;
  currentCurrencyToCustomer: Currency;
  amountCurrencyFromCustomer: number;
  amountCurrencyToCustomer: number;
  percentageTable: Percentage[];
  lastModifiedField: "FROM" | "TO";
}

export const initFn = (initialCurrencies: {
  initialCurrencyFromCustomer: Currency;
  initialCurrencyToCustomer: Currency;
}): CalculatorState => {
  return {
    currentCurrencyFromCustomer: initialCurrencies.initialCurrencyFromCustomer,
    currentCurrencyToCustomer: initialCurrencies.initialCurrencyToCustomer,
    amountCurrencyFromCustomer: 0,
    amountCurrencyToCustomer: 0,
    percentageTable: [],
    lastModifiedField: "FROM"
  };
};

export const reducer = (state: CalculatorState, action: Actions): CalculatorState => {
  switch (action.type) {
    case ActionType.SET_CURRENT_CURRENCY_FROM_CUSTOMER:
      return {
        ...state,
        currentCurrencyFromCustomer: action.payload.currency
      };

    case ActionType.SET_CURRENT_CURRENCY_TO_CUSTOMER:
      return {
        ...state,
        currentCurrencyToCustomer: action.payload.currency
      };

    default:
      return state;
  }
};
