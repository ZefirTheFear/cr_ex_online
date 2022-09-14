import type { NextApiRequest, NextApiResponse } from "next";

import { Rates } from "./../../models/currency";

type Data =
  | {
      message: string;
    }
  | { rates: Rates };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const response = await fetch("https://apiv2.bitcoinaverage.com/exchanges/ticker/binance", {
        headers: {
          "x-ba-key": `${process.env.BITCOINAVERAGE_KEY}`
        }
      });
      if (response.status !== 200) {
        return res.status(503).json({ message: "bitcoinaverage error" });
      }
      const responseData = await response.json();
      return res.status(200).json({
        rates: {
          BTC: responseData.symbols.BTCUSDT.bid,
          ETH: responseData.symbols.ETHUSDT.bid,
          LTC: responseData.symbols.LTCUSDT.bid,
          XMR: responseData.symbols.XMRUSDT.bid,
          XRP: responseData.symbols.XRPUSDT.bid,
          DOGE: responseData.symbols.DOGEUSDT.bid,
          SHIB: responseData.symbols.SHIBUSDT.bid,
          TRX: responseData.symbols.TRXUSDT.bid,
          DASH: responseData.symbols.DASHUSDT.bid,
          SOL: responseData.symbols.SOLUSDT.bid,
          ADA: responseData.symbols.ADAUSDT.bid,
          USDT: 1,
          UAH: 1 / responseData.symbols.USDTUAH.bid,
          USD: 1
        }
      });
    } catch (error) {
      return res.status(503).json({ message: "Error" });
    }
  } else {
    return;
  }
}
