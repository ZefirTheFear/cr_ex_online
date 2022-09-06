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
          BTC: responseData.symbols.BTCUSDT.bid * responseData.symbols.USDTUAH.bid,
          ETH: responseData.symbols.ETHUSDT.bid * responseData.symbols.USDTUAH.bid,
          LTC: responseData.symbols.LTCUSDT.bid * responseData.symbols.USDTUAH.bid,
          XMR: responseData.symbols.XMRUSDT.bid * responseData.symbols.USDTUAH.bid,
          XRP: responseData.symbols.XRPUSDT.bid * responseData.symbols.USDTUAH.bid,
          DOGE: responseData.symbols.DOGEUSDT.bid * responseData.symbols.USDTUAH.bid,
          SHIB: responseData.symbols.SHIBUSDT.bid * responseData.symbols.USDTUAH.bid,
          TRX: responseData.symbols.TRXUSDT.bid * responseData.symbols.USDTUAH.bid,
          DASH: responseData.symbols.DASHUSDT.bid * responseData.symbols.USDTUAH.bid,
          SOL: responseData.symbols.SOLUSDT.bid * responseData.symbols.USDTUAH.bid,
          ADA: responseData.symbols.ADAUSDT.bid * responseData.symbols.USDTUAH.bid,
          USDT: responseData.symbols.USDTUAH.bid,
          UAH: 1
        }
      });
    } catch (error) {
      return res.status(503).json({ message: "Error" });
    }
  } else {
    return;
  }
}
