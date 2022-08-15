import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import cloneDeep from "clone-deep";

import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";

import { Languages } from "../../models/language";
import { Currencies, Currency, Rates } from "../../models/currency";
import { currencies } from "../../data/currencyItems";

import classes from "./Calculator.module.scss";

const controller = new AbortController();

interface CalculatorProps {
  startingCurrencies: {
    sellingCurrency: Currency;
    purchasedCurrency: Currency;
  };
}

const Calculator: React.FC<CalculatorProps> = ({ startingCurrencies }) => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const [newCurrencies, setNewCurrencies] = useState(currencies);
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const passRatesToCurrencies = useCallback((newRates: Rates) => {
    setNewCurrencies((prevState) => {
      const newCurrencies = cloneDeep(prevState);
      for (const currency of newCurrencies) {
        currency.value = newRates[`${currency.name}`];
      }
      return newCurrencies;
    });
  }, []);

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
      const responseData = await response.json();
      console.log(responseData);
      passRatesToCurrencies(responseData.rates);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return setIsSomethingWentWrong(true);
    }
  }, [passRatesToCurrencies]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    fetchRates();
    return () => {
      controller.abort();
    };
  }, [fetchRates]);

  return (
    <>
      {isLoading && <Spinner />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "something went wrong. try again"
              : language === Languages.ua
              ? "Щось пішло не так"
              : "Что-то пошло не так"
          }
        />
      )}
      <div className={classes.calculator}>
        <div className={classes.calculator__rates}>
          {newCurrencies.map((currency) => {
            if (currency.name === Currencies.uah) {
              return;
            } else {
              return (
                <div className={classes["calculator__rates-item"]} key={currency.name}>
                  <Image src={currency.img} width={20} height={20} layout="fixed" />
                  <span className={classes["calculator__rates-item-name"]}>{currency.name}</span>
                  <span className={classes["calculator__rates-item-rate"]}>
                    :{" "}
                    {currency.name === Currencies.shib
                      ? `${(currency.value * 1000).toFixed(2)}*`
                      : currency.value.toFixed(2)}
                  </span>
                </div>
              );
            }
          })}
        </div>
        <div className={classes.calculator__rates__note}>
          * - {language === Languages.en ? "for 1000 coins" : "за 1000 монет"}
        </div>
        <div>
          <input type="number" />
          <div>{startingCurrencies.sellingCurrency.name}</div>
          <input type="number" />
          <div>{startingCurrencies.purchasedCurrency.name}</div>
        </div>
        <div>you will receive as much as indicated.</div>
        <button>exchange</button>
      </div>
    </>
  );
};

export default Calculator;
