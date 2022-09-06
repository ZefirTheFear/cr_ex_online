import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import cloneDeep from "clone-deep";

import { TiArrowRepeat } from "react-icons/ti";
import { ImCheckboxChecked } from "react-icons/im";

import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";
import ExchangeData from "../ExchangeData/ExchangeData";

import { Languages } from "../../models/language";
import { Currencies, Currency, Rates } from "../../models/currency";
import { currencies } from "../../data/currencyItems";

import classes from "./Calculator.module.scss";

const controller = new AbortController();

interface CalculatorProps {
  startingCurrencies: {
    sendingCurrency: Currency;
    receivedCurrency: Currency;
  };
}

const Calculator: React.FC<CalculatorProps> = ({ startingCurrencies }) => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const [currentSendingCurrency, setCurrentSendingCurrency] = useState(
    startingCurrencies.sendingCurrency
  );
  const [currentReceivedCurrency, setCurrentReceivedCurrency] = useState(
    startingCurrencies.receivedCurrency
  );
  const [newCurrencies, setNewCurrencies] = useState(currencies);
  const [isLoading, setIsLoading] = useState(false);
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

      const responseData = (await response.json()) as { rates: Rates };
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
    // fetchRates();
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
        <div className={classes.calculator__rates__block}>
          <div className={classes.calculator__rates}>
            {newCurrencies.map((currency) => {
              if (currency.name === Currencies.uah) {
                return;
              } else {
                return (
                  <div className={classes["calculator__rates-item"]} key={currency.name}>
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
                      {currency.name === Currencies.shib
                        ? `${(currency.value * 1000).toFixed(2)}*`
                        : currency.value.toFixed(2)}
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
              currentCurrency={currentSendingCurrency}
              currencyOptions={newCurrencies}
            />
            <div className={classes.calculator__swaper}>
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
              currentCurrency={currentReceivedCurrency}
              currencyOptions={newCurrencies}
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
          <button className={classes["calculator__exchange-btn"]}>
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
