import { StaticImageData } from "next/image";

export enum Currencies {
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
  uah = "UAH"
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
};

export interface Currency {
  name: Currencies;
  img: StaticImageData;
  value: number;
}
