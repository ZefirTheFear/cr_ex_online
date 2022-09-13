import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Currency } from "../../models/currency";

import { FaAngleDown } from "react-icons/fa";

import classes from "./ExchangeData.module.scss";

interface ExchangeDataProps {
  title: string;
  currentCurrency: Currency;
  currencyOptions: Currency[];
  onChangeCurrency: (e: React.MouseEvent<HTMLLIElement>) => void;
  value: string;
  onChangeInputAmount: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExchangeData: React.FC<ExchangeDataProps> = ({
  title,
  currentCurrency,
  currencyOptions,
  onChangeCurrency,
  value,
  onChangeInputAmount
}) => {
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

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(event);
    if (event.key === "-" || event.key === "+") {
      return event.preventDefault();
    }
  }, []);

  const onPaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    // const textData = event.clipboardData.getData("text");
    // console.log(textData);
    // // event.clipboardData.setData("text", "555888999");
    // const selection = window.getSelection();
    // console.log("selection: ", selection);
    // if (!selection || !selection.rangeCount) {
    //   return;
    // }
    // document.createRange;
    // selection.deleteFromDocument();
    // selection.getRangeAt(0).insertNode(document.createTextNode("555888999"));
  }, []);

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
          min="0"
          value={value}
          onChange={onChangeInputAmount}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
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
                onClick={onChangeCurrency}
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
