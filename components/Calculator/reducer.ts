import { Currency, CurrencyType } from "../../models/currency";

enum ActionType {
  SET_CURRENT_CURRENCY_FROM_CUSTOMER = "SET_CURRENT_CURRENCY_FROM_CUSTOMER",
  SET_CURRENT_CURRENCY_TO_CUSTOMER = "SET_CURRENT_CURRENCY_TO_CUSTOMER",
  SET_AMOUNT_CURRENCY_FROM_CUSTOMER = "SET_AMOUNT_CURRENCY_FROM_CUSTOMER",
  SET_AMOUNT_CURRENCY_TO_CUSTOMER = "SET_AMOUNT_CURRENCY_TO_CUSTOMER",
  SWAP_CURRENCIES = "SWAP_CURRENCIES",
  SET_PERCANTAGE_CONDITIONS = "SET_PERCANTAGE_CONDITIONS"
}

type PercentageConditions = {
  amountFrom: number;
  amountTo: number;
  percentBuyCrypto: number;
  percentSaleCrypto: number;
  percentExchangeCrypto: number;
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
    amount: string;
  };
}

interface SetAmountCurrencyToCustomerAction {
  type: ActionType.SET_AMOUNT_CURRENCY_TO_CUSTOMER;
  payload: {
    amount: string;
  };
}

interface SetPercentageConditionsAction {
  type: ActionType.SET_PERCANTAGE_CONDITIONS;
  payload: {
    percentageConditions: PercentageConditions[];
  };
}

type Actions =
  | SetCurrentCurrencyFromCustomerAction
  | SetCurrentCurrencyToCustomerAction
  | SwapCurrenciesAction
  | SetAmountCurrencyFromCustomerAction
  | SetAmountCurrencyToCustomerAction
  | SetPercentageConditionsAction;

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

export const setAmoutCurrencyFromCustomer = (
  amount: string
): SetAmountCurrencyFromCustomerAction => ({
  type: ActionType.SET_AMOUNT_CURRENCY_FROM_CUSTOMER,
  payload: {
    amount
  }
});

export const setAmoutCurrencyToCustomer = (amount: string): SetAmountCurrencyToCustomerAction => ({
  type: ActionType.SET_AMOUNT_CURRENCY_TO_CUSTOMER,
  payload: {
    amount
  }
});

export const swapCurrencies = (): SwapCurrenciesAction => ({
  type: ActionType.SWAP_CURRENCIES
});

const convert = (convertData: {
  amount: string;
  currencyFromCustomer: Currency;
  currencyToCustomer: Currency;
  changedField: "FROM_CUSTOMER" | "TO_CUSTOMER";
  percentageConditionsArray: PercentageConditions[];
}): string => {
  const {
    amount,
    currencyFromCustomer,
    currencyToCustomer,
    changedField,
    percentageConditionsArray
  } = convertData;

  if (amount === "" || +amount < 0) {
    return "";
  }

  let operationType: "sale" | "buy" | "exchange";
  if (
    currencyFromCustomer.type === CurrencyType.crypto &&
    currencyToCustomer.type === CurrencyType.crypto
  ) {
    operationType = "exchange";
  } else if (
    currencyFromCustomer.type === CurrencyType.crypto &&
    currencyToCustomer.type === CurrencyType.fiat
  ) {
    operationType = "sale";
  } else if (
    currencyFromCustomer.type === CurrencyType.fiat &&
    currencyToCustomer.type === CurrencyType.crypto
  ) {
    operationType = "buy";
  } else {
    return "";
  }

  const usdValueOfChangedField =
    changedField === "FROM_CUSTOMER"
      ? +amount * currencyFromCustomer.usdValue
      : +amount * currencyToCustomer.usdValue;
  const tempPercentageConditions =
    percentageConditionsArray.find(
      (percent) =>
        usdValueOfChangedField >= percent.amountFrom && usdValueOfChangedField < percent.amountTo
    ) || percentageConditionsArray[percentageConditionsArray.length - 1];

  let convertedValue = "";

  if (changedField === "FROM_CUSTOMER") {
    const percentageConditions = tempPercentageConditions;
    const usdValue = usdValueOfChangedField;

    const commissionPercent =
      operationType === "sale"
        ? percentageConditions.percentSaleCrypto
        : operationType === "buy"
        ? percentageConditions.percentBuyCrypto
        : percentageConditions.percentExchangeCrypto;

    convertedValue = ((usdValue / currencyToCustomer.usdValue) * ((100 - commissionPercent) / 100))
      .toFixed(4)
      .toString();
  }

  if (changedField === "TO_CUSTOMER") {
    const tempCommissionPercent =
      operationType === "sale"
        ? tempPercentageConditions.percentSaleCrypto
        : operationType === "buy"
        ? tempPercentageConditions.percentBuyCrypto
        : tempPercentageConditions.percentExchangeCrypto;

    const tempUsdValue = usdValueOfChangedField / ((100 - tempCommissionPercent) / 100);
    if (tempUsdValue >= tempPercentageConditions.amountTo) {
      const realPercentageConditions =
        percentageConditionsArray.find(
          (percent) => tempUsdValue >= percent.amountFrom && tempUsdValue < percent.amountTo
        ) || percentageConditionsArray[percentageConditionsArray.length - 1];

      const realCommissionPercent =
        operationType === "sale"
          ? realPercentageConditions.percentSaleCrypto
          : operationType === "buy"
          ? realPercentageConditions.percentBuyCrypto
          : realPercentageConditions.percentExchangeCrypto;

      const newTempUsdValue = usdValueOfChangedField / ((100 - realCommissionPercent) / 100);

      const convertedUsdValue =
        newTempUsdValue >= realPercentageConditions.amountFrom
          ? newTempUsdValue
          : realPercentageConditions.amountFrom;

      convertedValue = (convertedUsdValue / currencyFromCustomer.usdValue).toFixed(4).toString();
    } else {
      convertedValue = (tempUsdValue / currencyFromCustomer.usdValue).toFixed(4).toString();
    }
  }

  return convertedValue;
};

interface CalculatorState {
  currentCurrencyFromCustomer: Currency;
  currentCurrencyToCustomer: Currency;
  amountCurrencyFromCustomer: string;
  amountCurrencyToCustomer: string;
  percentageConditionsArray: PercentageConditions[];
  lastModifiedField: "FROM_CUSTOMER" | "TO_CUSTOMER";
}

export const initFn = (initialCurrencies: {
  initialCurrencyFromCustomer: Currency;
  initialCurrencyToCustomer: Currency;
}): CalculatorState => {
  return {
    currentCurrencyFromCustomer: initialCurrencies.initialCurrencyFromCustomer,
    currentCurrencyToCustomer: initialCurrencies.initialCurrencyToCustomer,
    amountCurrencyFromCustomer: "",
    amountCurrencyToCustomer: "",
    percentageConditionsArray: [
      {
        amountFrom: 0,
        amountTo: 1000,
        percentBuyCrypto: 5,
        percentSaleCrypto: 5,
        percentExchangeCrypto: 2
      },
      {
        amountFrom: 1000,
        amountTo: 10000,
        percentBuyCrypto: 3,
        percentSaleCrypto: 3,
        percentExchangeCrypto: 1
      },
      {
        amountFrom: 10000,
        amountTo: 50000,
        percentBuyCrypto: 1,
        percentSaleCrypto: 1,
        percentExchangeCrypto: 1
      }
    ],
    lastModifiedField: "FROM_CUSTOMER"
  };
};

export const reducer = (state: CalculatorState, action: Actions): CalculatorState => {
  switch (action.type) {
    case ActionType.SET_CURRENT_CURRENCY_FROM_CUSTOMER:
      if (state.lastModifiedField === "FROM_CUSTOMER") {
        return {
          ...state,
          currentCurrencyFromCustomer: action.payload.currency,
          amountCurrencyToCustomer: convert({
            amount: state.amountCurrencyFromCustomer,
            currencyFromCustomer: action.payload.currency,
            currencyToCustomer: state.currentCurrencyToCustomer,
            changedField: "FROM_CUSTOMER",
            percentageConditionsArray: state.percentageConditionsArray
          })
        };
      } else {
        return {
          ...state,
          currentCurrencyFromCustomer: action.payload.currency,
          amountCurrencyFromCustomer: convert({
            amount: state.amountCurrencyToCustomer,
            currencyFromCustomer: action.payload.currency,
            currencyToCustomer: state.currentCurrencyToCustomer,
            changedField: "TO_CUSTOMER",
            percentageConditionsArray: state.percentageConditionsArray
          })
        };
      }

    case ActionType.SET_CURRENT_CURRENCY_TO_CUSTOMER:
      if (state.lastModifiedField === "FROM_CUSTOMER") {
        return {
          ...state,
          currentCurrencyToCustomer: action.payload.currency,
          amountCurrencyToCustomer: convert({
            amount: state.amountCurrencyFromCustomer,
            currencyFromCustomer: state.currentCurrencyFromCustomer,
            currencyToCustomer: action.payload.currency,
            changedField: "FROM_CUSTOMER",
            percentageConditionsArray: state.percentageConditionsArray
          })
        };
      } else {
        return {
          ...state,
          currentCurrencyToCustomer: action.payload.currency,
          amountCurrencyFromCustomer: convert({
            amount: state.amountCurrencyToCustomer,
            currencyFromCustomer: state.currentCurrencyFromCustomer,
            currencyToCustomer: action.payload.currency,
            changedField: "TO_CUSTOMER",
            percentageConditionsArray: state.percentageConditionsArray
          })
        };
      }

    case ActionType.SET_AMOUNT_CURRENCY_FROM_CUSTOMER:
      return {
        ...state,
        amountCurrencyFromCustomer: action.payload.amount,
        amountCurrencyToCustomer: convert({
          amount: action.payload.amount,
          currencyFromCustomer: state.currentCurrencyFromCustomer,
          currencyToCustomer: state.currentCurrencyToCustomer,
          changedField: "FROM_CUSTOMER",
          percentageConditionsArray: state.percentageConditionsArray
        }),
        lastModifiedField: "FROM_CUSTOMER"
      };

    case ActionType.SET_AMOUNT_CURRENCY_TO_CUSTOMER:
      return {
        ...state,
        amountCurrencyFromCustomer: convert({
          amount: action.payload.amount,
          currencyFromCustomer: state.currentCurrencyFromCustomer,
          currencyToCustomer: state.currentCurrencyToCustomer,
          changedField: "TO_CUSTOMER",
          percentageConditionsArray: state.percentageConditionsArray
        }),
        amountCurrencyToCustomer: action.payload.amount,
        lastModifiedField: "TO_CUSTOMER"
      };

    case ActionType.SWAP_CURRENCIES:
      return {
        ...state,
        currentCurrencyFromCustomer: state.currentCurrencyToCustomer,
        currentCurrencyToCustomer: state.currentCurrencyFromCustomer,
        amountCurrencyFromCustomer:
          state.lastModifiedField === "FROM_CUSTOMER"
            ? convert({
                amount: state.amountCurrencyFromCustomer,
                currencyFromCustomer: state.currentCurrencyToCustomer,
                currencyToCustomer: state.currentCurrencyFromCustomer,
                changedField: "TO_CUSTOMER",
                percentageConditionsArray: state.percentageConditionsArray
              })
            : state.amountCurrencyToCustomer,
        amountCurrencyToCustomer:
          state.lastModifiedField === "FROM_CUSTOMER"
            ? state.amountCurrencyFromCustomer
            : convert({
                amount: state.amountCurrencyToCustomer,
                currencyFromCustomer: state.currentCurrencyToCustomer,
                currencyToCustomer: state.currentCurrencyFromCustomer,
                changedField: "FROM_CUSTOMER",
                percentageConditionsArray: state.percentageConditionsArray
              }),
        lastModifiedField:
          state.lastModifiedField === "FROM_CUSTOMER" ? "TO_CUSTOMER" : "FROM_CUSTOMER"
      };

    default:
      return state;
  }
};
