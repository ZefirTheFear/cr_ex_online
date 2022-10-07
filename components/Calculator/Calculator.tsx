import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import cloneDeep from "clone-deep";

import { TiArrowRepeat } from "react-icons/ti";
import { ImCheckboxChecked } from "react-icons/im";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import Modal from "../Modal/Modal";
import ExchangeData from "../ExchangeData/ExchangeData";

import { Languages } from "../../models/language";
import {
  CurrencyName,
  Currency,
  Rates,
  CurrencyType,
  CurrencyProtocol
} from "../../models/currency";
import { currencies } from "../../data/currencyItems";

import {
  reducer,
  initFn,
  setCurrentCurrencyFromCustomer,
  setCurrentCurrencyToCustomer,
  setAmoutCurrencyFromCustomer,
  setAmoutCurrencyToCustomer,
  swapCurrencies
} from "./reducer";

import classes from "./Calculator.module.scss";

interface CalculatorProps {
  initialCurrencies: {
    initialCurrencyFromCustomer: Currency;
    initialCurrencyToCustomer: Currency;
  };
}

const Calculator: React.FC<CalculatorProps> = ({ initialCurrencies }) => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const router = useRouter();
  const language = router.query.lang as Languages;

  const [calculatorState, dispatch] = useReducer(reducer, initialCurrencies, initFn);

  const [newCurrencies, setNewCurrencies] = useState(currencies);
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const onChangeCurrentCurrencyFromCustomer = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const currencyId = e.currentTarget.getAttribute("data-id");
      if (!currencyId) {
        return;
      }

      const newSelectedCurrency = newCurrencies.find((currency) => currency.id === currencyId);
      if (!newSelectedCurrency) {
        return;
      }
      if (newSelectedCurrency.name === calculatorState.currentCurrencyToCustomer.name) {
        dispatch(swapCurrencies());
        return;
      }

      if (
        newSelectedCurrency.type === CurrencyType.fiat &&
        calculatorState.currentCurrencyToCustomer.type === CurrencyType.fiat
      ) {
        const newCurrencyToCustomer = newCurrencies.find(
          (currency) => currency.name === CurrencyName.usdt
        );
        if (!newCurrencyToCustomer) {
          return;
        }
        dispatch(setCurrentCurrencyFromCustomer(newSelectedCurrency));
        dispatch(setCurrentCurrencyToCustomer(newCurrencyToCustomer));
        return;
      }

      dispatch(setCurrentCurrencyFromCustomer(newSelectedCurrency));
    },
    [
      calculatorState.currentCurrencyToCustomer.name,
      calculatorState.currentCurrencyToCustomer.type,
      newCurrencies
    ]
  );

  const changeCurrentCurrencyToCustomer = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const currencyId = e.currentTarget.getAttribute("data-id");
      if (!currencyId) {
        return;
      }

      const newSelectedCurrency = newCurrencies.find((currency) => currency.id === currencyId);
      if (!newSelectedCurrency) {
        return;
      }
      if (newSelectedCurrency.name === calculatorState.currentCurrencyFromCustomer.name) {
        dispatch(swapCurrencies());
        return;
      }

      if (
        newSelectedCurrency.type === CurrencyType.fiat &&
        calculatorState.currentCurrencyFromCustomer.type === CurrencyType.fiat
      ) {
        const newCurrencyFromCustomer = newCurrencies.find(
          (currency) => currency.name === CurrencyName.usdt
        );
        if (!newCurrencyFromCustomer) {
          return;
        }
        dispatch(setCurrentCurrencyFromCustomer(newCurrencyFromCustomer));
        dispatch(setCurrentCurrencyToCustomer(newSelectedCurrency));
        return;
      }

      dispatch(setCurrentCurrencyToCustomer(newSelectedCurrency));
    },
    [
      calculatorState.currentCurrencyFromCustomer.name,
      calculatorState.currentCurrencyFromCustomer.type,
      newCurrencies
    ]
  );

  const changeAmountCurrencyFromCustomer = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmoutCurrencyFromCustomer(e.currentTarget.value));
  }, []);

  const changeAmountCurrencyToCustomer = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmoutCurrencyToCustomer(e.currentTarget.value));
  }, []);

  const swap = useCallback(() => {
    dispatch(swapCurrencies());
  }, []);

  const passRatesToCurrencies = useCallback(
    (newRates: Rates) => {
      const newCurrentCurrencyFromCustomer = cloneDeep(
        initialCurrencies.initialCurrencyFromCustomer
      );
      const newCurrentCurrencyToCustomer = cloneDeep(initialCurrencies.initialCurrencyToCustomer);
      newCurrentCurrencyFromCustomer.usdValue = newRates[`${newCurrentCurrencyFromCustomer.name}`];
      newCurrentCurrencyToCustomer.usdValue = newRates[`${newCurrentCurrencyToCustomer.name}`];
      dispatch(setCurrentCurrencyFromCustomer(newCurrentCurrencyFromCustomer));
      dispatch(setCurrentCurrencyToCustomer(newCurrentCurrencyToCustomer));

      setNewCurrencies((prevState) => {
        const newCurrencies = cloneDeep(prevState);
        for (const currency of newCurrencies) {
          currency.usdValue = newRates[`${currency.name}`];
        }
        return newCurrencies;
      });
    },
    [initialCurrencies.initialCurrencyFromCustomer, initialCurrencies.initialCurrencyToCustomer]
  );

  const fetchRates = useCallback(async () => {
    try {
      const response = await fetch("/api/fetch-rates", {
        method: "GET",
        signal: controller.signal
      });

      if (response.status !== 200) {
        setIsLoading(false);
        return setIsSomethingWentWrong(true);
      }

      const responseData = (await response.json()) as { rates: Rates };
      console.log(responseData);
      passRatesToCurrencies(responseData.rates);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return setIsSomethingWentWrong(true);
    }
  }, [controller.signal, passRatesToCurrencies]);

  const createNewOrder = useCallback(async () => {
    // TODO Validation
    // setIsLoading(true);
    // try {
    //   const response = await fetch("/api/orders/init-new-order", {
    //     method: 'POST',
    //     signal: controller.signal
    //   });
    // } catch (error) {
    //   setIsLoading(false);
    // return setIsSomethingWentWrong(true);
    // }
  }, []);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    // fetchRates();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      controller.abort();
    };
  }, [controller, fetchRates]);

  return (
    <>
      {isLoading && <BlockSpinner />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "Something went wrong. Try again later"
              : language === Languages.ua
              ? "Щось пішло не так. Cпробуйте пізніше"
              : "Что-то пошло не так. Попробуйте позже"
          }
        />
      )}
      <div className={classes.calculator}>
        <div className={classes.calculator__rates__block}>
          <div className={classes.calculator__rates}>
            {newCurrencies.map((currency) => {
              if (
                currency.name === CurrencyName.uah ||
                currency.name === CurrencyName.usd ||
                (currency.name === CurrencyName.usdt &&
                  currency.protocol === CurrencyProtocol.erc20)
              ) {
                return;
              } else {
                return (
                  <div className={classes["calculator__rates-item"]} key={currency.id}>
                    <Image
                      src={currency.img}
                      width={20}
                      height={20}
                      alt={`${currency.name}-logo`}
                      layout="fixed"
                      quality={100}
                    />
                    <span className={classes["calculator__rates-item-name"]}>{currency.name}</span>
                    <span className={classes["calculator__rates-item-rate"]}>
                      :{" "}
                      {currency.name === CurrencyName.shib
                        ? `${(currency.usdValue * 1000).toFixed(2)}*`
                        : currency.usdValue.toFixed(2)}
                    </span>
                  </div>
                );
              }
            })}
          </div>
          <small className={classes.calculator__rates__note}>
            * - {language === Languages.en ? "for 1000 coins" : "за 1000 монет"}
          </small>
        </div>
        <div className={classes.calculator__converter__block}>
          <div className={classes.calculator__converter}>
            <ExchangeData
              title={
                language === Languages.en
                  ? "Send"
                  : language === Languages.ua
                  ? "Відправляєте"
                  : "Отправляете"
              }
              currentCurrency={calculatorState.currentCurrencyFromCustomer}
              currencyOptions={newCurrencies}
              onChangeCurrency={onChangeCurrentCurrencyFromCustomer}
              value={calculatorState.amountCurrencyFromCustomer}
              onChangeInputAmount={changeAmountCurrencyFromCustomer}
            />
            <div className={classes.calculator__swaper} onClick={swap}>
              <TiArrowRepeat />
            </div>
            <ExchangeData
              title={
                language === Languages.en
                  ? "Receive"
                  : language === Languages.ua
                  ? "Отримуєте"
                  : "Получаете"
              }
              currentCurrency={calculatorState.currentCurrencyToCustomer}
              currencyOptions={newCurrencies}
              onChangeCurrency={changeCurrentCurrencyToCustomer}
              value={calculatorState.amountCurrencyToCustomer}
              onChangeInputAmount={changeAmountCurrencyToCustomer}
            />
          </div>
          <div className={classes.calculator__note}>
            <span className={classes["calculator__note-icon"]}>
              <ImCheckboxChecked />
            </span>
            <span className={classes["calculator__note-text"]}>
              {language === Languages.en
                ? "Already with the commission."
                : language === Languages.ua
                ? "Вже з урахуванням комісії."
                : "Уже с учетом комиссии"}
            </span>
            <span className={classes["calculator__note-link"]}>
              <Link href={`/${encodeURIComponent(language)}/fees`}>
                {language === Languages.en
                  ? "Learn more"
                  : language === Languages.ua
                  ? "Дізнатися більше"
                  : "Узнать больше"}
              </Link>
            </span>
          </div>
          <button className={classes["calculator__exchange-btn"]} onClick={createNewOrder}>
            {language === Languages.en
              ? "Exchange"
              : language === Languages.ua
              ? "Обміняти"
              : "Обменять"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Calculator;
