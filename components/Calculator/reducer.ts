import { Currency, CurrencyType } from "../../models/currency";

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

const convert = (convertData: {
  amount: string;
  currencyFromCustomer: Currency;
  currencyToCustomer: Currency;
  changedField: "FROM_CUSTOMER" | "TO_CUSTOMER";
  percentages: Percentage[];
}): string => {
  const { amount, currencyFromCustomer, currencyToCustomer, changedField, percentages } =
    convertData;

  // console.log(convertData);

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

  const usdValue =
    changedField === "FROM_CUSTOMER"
      ? +amount * currencyFromCustomer.value
      : +amount * currencyToCustomer.value;
  const percentage =
    percentages.find((percent) => usdValue >= percent.amountFrom && usdValue < percent.amountTo) ||
    percentages[percentages.length - 1];

  let convertedValue = "";
  // console.log("operationType: ", operationType);
  // console.log("changedField: ", changedField);

  if (operationType === "sale" && changedField === "FROM_CUSTOMER") {
    convertedValue = (
      +amount *
      currencyFromCustomer.value *
      ((100 - percentage.percentSaleCrypto) / 100)
    )
      .toFixed(4)
      .toString();
  }

  if (operationType === "sale" && changedField === "TO_CUSTOMER") {
    const tempConvertedValue =
      (+amount * currencyToCustomer.value) / ((100 - percentage.percentSaleCrypto) / 100);
    // console.log("tempConvertedValue: ", tempConvertedValue);
    // console.log("percentage.amountTo: ", percentage.amountTo);
    if (tempConvertedValue >= percentage.amountTo) {
      const newPercentage =
        percentages.find(
          (percent) =>
            tempConvertedValue >= percent.amountFrom && tempConvertedValue < percent.amountTo
        ) || percentages[percentages.length - 1];

      const newTempConvertedValue =
        (+amount * currencyToCustomer.value) / ((100 - newPercentage.percentSaleCrypto) / 100);

      convertedValue = (
        newTempConvertedValue >= newPercentage.amountFrom
          ? newTempConvertedValue
          : newPercentage.amountFrom
      )
        .toFixed(4)
        .toString();
      // if (newTempConvertedValue< newPercentage.amountFrom) {
      //   convertedValue =newPercentage.amountFrom
      // } else {}
    } else {
      convertedValue = tempConvertedValue.toFixed(4).toString();
    }
  }
  return convertedValue;
};

interface CalculatorState {
  currentCurrencyFromCustomer: Currency;
  currentCurrencyToCustomer: Currency;
  amountCurrencyFromCustomer: string;
  amountCurrencyToCustomer: string;
  percentageTable: Percentage[];
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
    percentageTable: [
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
      return {
        ...state,
        currentCurrencyFromCustomer: action.payload.currency
      };

    case ActionType.SET_CURRENT_CURRENCY_TO_CUSTOMER:
      return {
        ...state,
        currentCurrencyToCustomer: action.payload.currency
      };

    case ActionType.SET_AMOUNT_CURRENCY_FROM_CUSTOMER:
      return {
        ...state,
        amountCurrencyFromCustomer: action.payload.amount,
        amountCurrencyToCustomer: convert({
          amount: action.payload.amount,
          currencyFromCustomer: state.currentCurrencyFromCustomer,
          currencyToCustomer: state.currentCurrencyToCustomer,
          changedField: "FROM_CUSTOMER",
          percentages: state.percentageTable
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
          percentages: state.percentageTable
        }),
        amountCurrencyToCustomer: action.payload.amount,
        lastModifiedField: "TO_CUSTOMER"
      };

    default:
      return state;
  }
};
