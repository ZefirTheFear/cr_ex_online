import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";

import Visa from "../../assets/card/visa.svg";
import MC from "../../assets/card/master-card.svg";
import { OperationType, OrderWallet } from "../../models/utils";

import { Languages } from "../../models/language";
import { Currency } from "../../models/currency";
import InputGroup, { InputGroupType } from "../InputGroup/InputGroup";

import classes from "./EFUserWalletForm.module.scss";

interface UserWalletFormProps {
  operationType: OperationType;
  currency: Currency;
  proceed: (wallet: string) => void;
}

const UserWalletForm: React.FC<UserWalletFormProps> = ({ operationType, currency, proceed }) => {
  const router = useRouter();
  const language = router.query.lang as Languages;

  const cardInput = useRef<HTMLInputElement>(null);

  const [inputError, setInputError] = useState<string[]>();

  const focusInput = useCallback(() => {
    setInputError(undefined);
  }, []);

  const goToNextStep = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!cardInput.current) {
        return new Error("no input");
      }

      // TODO Validation ???

      proceed(cardInput.current.value);
    },
    [proceed]
  );

  return (
    <div className={classes["user-wallet"]}>
      <h3 className={classes["user-wallet__heading"]}>
        {language === Languages.en
          ? "Where to receive?"
          : language === Languages.ua
          ? "Куди отримувати?"
          : "Куда получать?"}
      </h3>
      <p className={classes["user-wallet__paragraph"]}>
        {operationType === OperationType.cryptoToFiat
          ? language === Languages.en
            ? "Please enter the number of your card to which the funds will be transferred."
            : language === Languages.ua
            ? "Вкажіть, будь ласка, номер вашої картки, на яку здійснити переказ коштів."
            : "Укажите, пожалуйста, номер вашей карты, на которую будет осуществлен перевод средств."
          : language === Languages.en
          ? "Please enter the wallet to which the funds will be transferred."
          : language === Languages.ua
          ? "Вкажіть, будь ласка, гаманець, на який здійснити переказ коштів."
          : "Укажите, пожалуйста, кошелек, на который будет осуществлен перевод средств."}
      </p>
      <div>
        {operationType === OperationType.cryptoToFiat ? (
          <form className={classes["user-wallet__card"]} onSubmit={goToNextStep} noValidate>
            <div className={classes["user-wallet__card-top"]}>
              <div className={classes["user-wallet__card-title"]}>
                {language === Languages.en
                  ? "Your card"
                  : language === Languages.ua
                  ? "Ваша картка"
                  : "Ваша карта"}
              </div>
              <div className={classes["user-wallet__card-logo"]}>
                <span>
                  <Visa />
                </span>
                <span>
                  <MC />
                </span>
              </div>
            </div>
            <div>
              <InputGroup
                title={
                  language === Languages.en
                    ? "Card Number"
                    : language === Languages.ua
                    ? "Номер картки"
                    : "Номер карты"
                }
                type={InputGroupType.text}
                placeholder="XXXX XXXX XXXX XXXX"
                name="card"
                errors={inputError ? inputError : null}
                ref={cardInput}
                onFocus={focusInput}
              />
            </div>
            <button className={classes["user-wallet__submit-btn"]} type="submit">
              {language === Languages.en
                ? "Proceed"
                : language === Languages.ua
                ? "Продовжити"
                : "Продолжить"}
            </button>
          </form>
        ) : (
          <form className={classes["user-wallet__crypto"]} onSubmit={goToNextStep} noValidate>
            <div>
              <InputGroup
                title={`${currency.name} ${currency.protocol ? currency.protocol : ""}
                ${
                  language === Languages.en
                    ? "wallet"
                    : language === Languages.ua
                    ? "гаманець"
                    : "кошелек"
                }`}
                type={InputGroupType.text}
                placeholder={currency.placeholder || ""}
                miniFont
                name="card"
                errors={inputError ? inputError : null}
                ref={cardInput}
                onFocus={focusInput}
              />
            </div>
            <button className={classes["user-wallet__submit-btn"]} type="submit">
              {language === Languages.en
                ? "Proceed"
                : language === Languages.ua
                ? "Продовжити"
                : "Продолжить"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserWalletForm;
