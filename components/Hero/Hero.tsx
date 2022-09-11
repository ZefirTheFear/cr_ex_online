import { useMemo } from "react";
import Calculator from "../Calculator/Calculator";

import { Currency, CurrencyName } from "../../models/currency";
import { currencies } from "../../data/currencyItems";

import classes from "./Hero.module.scss";

interface HeroProps {
  text: { heading: string; paragraph: string };
}

const Hero: React.FC<HeroProps> = ({ text }) => {
  const initialCurrencies = useMemo(() => {
    return {
      initialCurrencyFromCustomer: currencies.find(
        (currency) => currency.name === CurrencyName.usdt
      ) as Currency,
      initialCurrencyToCustomer: currencies.find(
        (currency) => currency.name === CurrencyName.uah
      ) as Currency
    };
  }, []);

  return (
    <section className={classes.hero}>
      <div className={classes.hero__inner}>
        <div className={classes.hero__text}>
          <h1 className={classes["hero__text-heading"]}>{text.heading}</h1>
          <p className={classes["hero__text-paragraph"]}>{text.paragraph}</p>
        </div>
        <div className={classes.hero__calculator}>
          <div className={classes["hero__calculator-inner"]}>
            <Calculator initialCurrencies={initialCurrencies} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
