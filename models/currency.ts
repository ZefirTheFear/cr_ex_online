import { StaticImageData } from "next/image";

export enum CurrencyName {
  btc = "BTC",
  eth = "ETH",
  usdt = "USDT",
  lct = "LTC",
  xrp = "XRP",
  xmr = "XMR",
  trx = "TRX",
  dash = "DASH",
  doge = "DOGE",
  shib = "SHIB",
  sol = "SOL",
  ada = "ADA",
  uah = "UAH",
  usd = "USD"
}

export type Rates = {
  BTC: number;
  ETH: number;
  USDT: number;
  LTC: number;
  XRP: number;
  XMR: number;
  TRX: number;
  DASH: number;
  DOGE: number;
  SHIB: number;
  SOL: number;
  ADA: number;
  UAH: number;
  USD: number;
};

export enum CurrencyType {
  crypto = "crypto",
  fiat = "fiat"
}

export interface Currency {
  name: CurrencyName;
  type: CurrencyType;
  usdValue: number;
  img: StaticImageData;
}
