import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Currency } from "../../models/currency";

import { FaAngleDown } from "react-icons/fa";

import DropdownList from "../DropdownList/DropdownList";
import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import classes from "./ExchangeDataInput.module.scss";

interface ExchangeDataProps {
  title: string;
  currentCurrency: Currency;
  currencyOptions: Currency[];
  onChangeCurrency: (e: React.MouseEvent<HTMLLIElement>) => void;
  value: string;
  onChangeInputAmount: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  clearError?: () => void;
}

const ExchangeData: React.FC<ExchangeDataProps> = ({
  title,
  currentCurrency,
  currencyOptions,
  onChangeCurrency,
  value,
  onChangeInputAmount,
  error,
  clearError
}) => {
  const optionsListElem = useRef<HTMLUListElement>(null);

  const [isOpenedCurrencyOptions, setIsOpenedCurrencyOptions] = useState(false);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
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
    if (isOpenedCurrencyOptions) {
      const ulElem = optionsListElem.current;
      if (ulElem) {
        ulElem.scrollTo({ top: 0 });
      }
    }
  }, [isOpenedCurrencyOptions]);

  return (
    <div className={classes["exchange-data"]}>
      <div className={classes["exchange-data__title"]}>{title}:</div>
      <div className={classes["exchange-data__input-group"]} onMouseDown={clearError}>
        <input
          className={
            `${classes["exchange-data__input-group__input"]}` +
            (error ? ` ${classes["exchange-data__input-group__input_invalid"]}` : ``)
          }
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
          <DropdownList
            isOpenOptions={isOpenedCurrencyOptions}
            setIsOpenOptions={setIsOpenedCurrencyOptions}
            toggler={
              <>
                <div className={classes["exchange-data__selected"]}>
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
                  <div className={classes["exchange-data__currency-name-container"]}>
                    <span className={classes["exchange-data__currency-name"]}>
                      {currentCurrency.name}
                    </span>
                    {currentCurrency.protocol && (
                      <small className={classes["exchange-data__currency-protocol"]}>
                        {currentCurrency.protocol}
                      </small>
                    )}
                  </div>
                  <span
                    className={
                      `${classes["exchange-data__select-arrow"]}` +
                      (isOpenedCurrencyOptions
                        ? ` ${classes["exchange-data__select-arrow_is-opened"]}`
                        : ``)
                    }
                  >
                    <FaAngleDown />
                  </span>
                </div>
              </>
            }
            options={
              <>
                <ul className={classes["exchange-data__options"]} ref={optionsListElem}>
                  {currencyOptions.map((currency) => (
                    <li
                      className={classes["exchange-data__select-options-item"]}
                      key={currency.id}
                      data-id={currency.id}
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
                      <div className={classes["exchange-data__currency-name-container"]}>
                        <span className={classes["exchange-data__currency-name"]}>
                          {currency.name}
                        </span>
                        {currency.protocol && (
                          <small className={classes["exchange-data__currency-protocol"]}>
                            {currency.protocol}
                          </small>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </div>
      </div>
      {error && <InvalidFeedback msg={error} />}
    </div>
  );
};

export default ExchangeData;
