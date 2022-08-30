import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Currency } from "../../models/currency";

import { FaAngleDown } from "react-icons/fa";

import classes from "./ExchangeData.module.scss";

interface ExchangeDataProps {
  title: string;
  currentCurrency: Currency;
  currencyOptions: Currency[];
}

const ExchangeData: React.FC<ExchangeDataProps> = ({ title, currentCurrency, currencyOptions }) => {
  const selectedElem = useRef<HTMLDivElement>(null);
  const optionsListElem = useRef<HTMLUListElement>(null);

  const [isOpenedOptions, setIsOpenedOptions] = useState(false);

  const toggleIsOpenedOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLUListElement;
    if (isOpenedOptions) {
      elem.style.borderWidth = "0";
      elem.style.marginTop = "";
      elem.style.height = "0";
      elem.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const borderWidth = 1;
      elem.style.borderWidth = `${borderWidth}px`;
      elem.style.marginTop = "0.75rem";
      // elem.style.height = elem.scrollHeight + borderWidth * 2 + "px";
      elem.style.height = "200px";
    }

    setIsOpenedOptions((prevState) => !prevState);
  }, [isOpenedOptions]);

  const closeCurrenciesOptions = useCallback(() => {
    const elem = optionsListElem.current as HTMLUListElement;
    elem.style.borderWidth = "0";
    elem.style.height = "0";
    elem.style.marginTop = "";
    elem.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpenedOptions(false);
  }, []);

  const closeOpenedOptions = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === selectedElem.current) {
          return;
        }
        const parentElement = element.parentElement;
        if (parentElement) {
          element = parentElement;
        } else {
          return;
        }
      }
      if (isOpenedOptions) {
        closeCurrenciesOptions();
      }
    },
    [closeCurrenciesOptions, isOpenedOptions]
  );

  useEffect(() => {
    window.addEventListener("click", closeOpenedOptions);
    return () => {
      window.removeEventListener("click", closeOpenedOptions);
    };
  }, [closeOpenedOptions]);

  return (
    <div className={classes["exchange-data"]}>
      <div className={classes["exchange-data__title"]}>{title}:</div>
      <div className={classes["exchange-data__input-group"]}>
        <input
          className={classes["exchange-data__input-group__input"]}
          type="number"
          placeholder="0.00"
          autoComplete="off"
        />
        <div className={classes["exchange-data__currency-selector"]}>
          <div
            className={classes["exchange-data__selected"]}
            onClick={toggleIsOpenedOptions}
            ref={selectedElem}
          >
            <span className={classes["exchange-data__currency-img"]}>
              <Image
                src={currentCurrency.img}
                alt={currentCurrency.name + "-logo"}
                width={30}
                height={30}
                layout="fixed"
                quality={100}
              />
            </span>
            <span className={classes["exchange-data__currency-name"]}>{currentCurrency.name}</span>
            <span
              className={
                `${classes["exchange-data__select-arrow"]}` +
                (isOpenedOptions ? ` ${classes["exchange-data__select-arrow_is-opened"]}` : ``)
              }
            >
              <FaAngleDown />
            </span>
          </div>
          <ul className={classes["exchange-data__select-options"]} ref={optionsListElem}>
            {currencyOptions.map((currency) => (
              <li
                className={classes["exchange-data__select-options-item"]}
                key={currency.name}
                data-name={currency.name}
                // onClick={onChangeCurrency}
              >
                <span className={classes["exchange-data__currency-img"]}>
                  <Image
                    src={currency.img}
                    alt={currency.name + "-logo"}
                    width={30}
                    height={30}
                    layout="fixed"
                    quality={100}
                  />
                </span>
                <span className={classes["exchange-data__currency-name"]}>{currency.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExchangeData;
