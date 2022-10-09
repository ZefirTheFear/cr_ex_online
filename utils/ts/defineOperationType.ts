import { Currency, CurrencyType } from "../../models/currency";
import { OperationType } from "../../models/utils";

export const defineOperationType = (incomingCurrencies: {
  currencyFromCustomer: Currency;
  currencyToCustomer: Currency;
}) => {
  if (
    incomingCurrencies.currencyFromCustomer.type === CurrencyType.crypto &&
    incomingCurrencies.currencyToCustomer.type === CurrencyType.crypto
  ) {
    return OperationType.cryptoToCrypto;
  } else if (
    incomingCurrencies.currencyFromCustomer.type === CurrencyType.crypto &&
    incomingCurrencies.currencyToCustomer.type === CurrencyType.fiat
  ) {
    return OperationType.cryptoToFiat;
  } else if (
    incomingCurrencies.currencyFromCustomer.type === CurrencyType.fiat &&
    incomingCurrencies.currencyToCustomer.type === CurrencyType.crypto
  ) {
    return OperationType.fiatToCrypto;
  } else {
    return;
  }
};
