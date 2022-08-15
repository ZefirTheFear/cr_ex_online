import { Currency, Currencies } from "../models/currency";

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
    name: Currencies.btc,
    img: btcIcon,
    value: 0
  },
  {
    name: Currencies.eth,
    img: ethIcon,
    value: 0
  },
  {
    name: Currencies.usdt,
    img: usdtIcon,
    value: 0
  },
  {
    name: Currencies.lct,
    img: ltcIcon,
    value: 0
  },
  {
    name: Currencies.xrp,
    img: xrpIcon,
    value: 0
  },
  {
    name: Currencies.xmr,
    img: xmrIcon,
    value: 0
  },
  {
    name: Currencies.doge,
    img: dogeIcon,
    value: 0
  },
  {
    name: Currencies.shib,
    img: shibaIcon,
    value: 0
  },
  {
    name: Currencies.trx,
    img: trxIcon,
    value: 0
  },
  {
    name: Currencies.dash,
    img: dashIcon,
    value: 0
  },
  {
    name: Currencies.ada,
    img: adaIcon,
    value: 0
  },
  {
    name: Currencies.sol,
    img: solIcon,
    value: 0
  },
  {
    name: Currencies.uah,
    img: uaFlag,
    value: 0
  }
];
