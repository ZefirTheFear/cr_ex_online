import { Currency, CurrencyName, CurrencyType } from "../models/currency";

import btcIcon from "../assets/currencyIcons/BTC.png";
import ethIcon from "../assets/currencyIcons/ETH.png";
import usdtIcon from "../assets/currencyIcons/USDT.png";
import ltcIcon from "../assets/currencyIcons/LTC.png";
import xrpIcon from "../assets/currencyIcons/XRP.png";
import xmrIcon from "../assets/currencyIcons/XMR.png";
import dashIcon from "../assets/currencyIcons/DASH.png";
import trxIcon from "../assets/currencyIcons/TRX.png";
import dogeIcon from "../assets/currencyIcons/DOGE.png";
import shibaIcon from "../assets/currencyIcons/SHIBA.png";
import adaIcon from "../assets/currencyIcons/ADA.png";
import solIcon from "../assets/currencyIcons/SOL.png";
import uaFlag from "../assets/flags/ua-flag.png";

export const currencies: Currency[] = [
  {
    name: CurrencyName.btc,
    type: CurrencyType.crypto,
    img: btcIcon,
    usdValue: 2
  },
  {
    name: CurrencyName.eth,
    type: CurrencyType.crypto,
    img: ethIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.usdt,
    type: CurrencyType.crypto,
    img: usdtIcon,
    usdValue: 1
  },
  {
    name: CurrencyName.lct,
    type: CurrencyType.crypto,
    img: ltcIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.xrp,
    type: CurrencyType.crypto,
    img: xrpIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.xmr,
    type: CurrencyType.crypto,
    img: xmrIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.doge,
    type: CurrencyType.crypto,
    img: dogeIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.shib,
    type: CurrencyType.crypto,
    img: shibaIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.trx,
    type: CurrencyType.crypto,
    img: trxIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.dash,
    type: CurrencyType.crypto,
    img: dashIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.ada,
    type: CurrencyType.crypto,
    img: adaIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.sol,
    type: CurrencyType.crypto,
    img: solIcon,
    usdValue: 0
  },
  {
    name: CurrencyName.uah,
    type: CurrencyType.fiat,
    img: uaFlag,
    usdValue: 0.1
  }
];
