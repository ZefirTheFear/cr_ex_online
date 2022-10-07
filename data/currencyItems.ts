import { Currency, CurrencyName, CurrencyProtocol, CurrencyType } from "../models/currency";

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
import usaFlag from "../assets/flags/usa-flag.png";

export const currencies: Currency[] = [
  {
    id: "btc",
    name: CurrencyName.btc,
    type: CurrencyType.crypto,
    img: btcIcon,
    usdValue: 2
  },
  {
    id: "eth",
    name: CurrencyName.eth,
    type: CurrencyType.crypto,
    img: ethIcon,
    usdValue: 0
  },
  {
    id: "usdt_trc20",
    name: CurrencyName.usdt,
    protocol: CurrencyProtocol.trc20,
    type: CurrencyType.crypto,
    img: usdtIcon,
    usdValue: 1
  },
  {
    id: "usdt_erc20",
    name: CurrencyName.usdt,
    protocol: CurrencyProtocol.erc20,
    type: CurrencyType.crypto,
    img: usdtIcon,
    usdValue: 1
  },
  {
    id: "ltc",
    name: CurrencyName.lct,
    type: CurrencyType.crypto,
    img: ltcIcon,
    usdValue: 0
  },
  {
    id: "xrp",
    name: CurrencyName.xrp,
    type: CurrencyType.crypto,
    img: xrpIcon,
    usdValue: 0
  },
  {
    id: "xmr",
    name: CurrencyName.xmr,
    type: CurrencyType.crypto,
    img: xmrIcon,
    usdValue: 0
  },
  {
    id: "doge",
    name: CurrencyName.doge,
    type: CurrencyType.crypto,
    img: dogeIcon,
    usdValue: 0
  },
  {
    id: "shib",
    name: CurrencyName.shib,
    type: CurrencyType.crypto,
    img: shibaIcon,
    usdValue: 0
  },
  {
    id: "trx",
    name: CurrencyName.trx,
    type: CurrencyType.crypto,
    img: trxIcon,
    usdValue: 0
  },
  {
    id: "dash",
    name: CurrencyName.dash,
    type: CurrencyType.crypto,
    img: dashIcon,
    usdValue: 0
  },
  {
    id: "ada",
    name: CurrencyName.ada,
    type: CurrencyType.crypto,
    img: adaIcon,
    usdValue: 0
  },
  {
    id: "sol",
    name: CurrencyName.sol,
    type: CurrencyType.crypto,
    img: solIcon,
    usdValue: 0
  },
  {
    id: "uah",
    name: CurrencyName.uah,
    type: CurrencyType.fiat,
    img: uaFlag,
    usdValue: 0.1
  },
  {
    id: "usd",
    name: CurrencyName.usd,
    type: CurrencyType.fiat,
    img: usaFlag,
    usdValue: 1
  }
];
