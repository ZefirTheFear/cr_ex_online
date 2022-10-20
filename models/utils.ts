import { Types } from "mongoose";

export enum UserStatus {
  user = "user",
  observer = "observer",
  admin = "admin"
}

export enum OrderStatus {
  clientPersonalData = "clientPersonalData",
  clientWallet = "clientWallet",
  payment = "payment",
  waiting = "waiting",
  confirmedByObserver = "confirmedByObserver",
  closed = "closed"
}

export enum OperationType {
  cryptoToFiat = "cryptoToFiat",
  fiatToCrypto = "fiatToCrypto",
  cryptoToCrypto = "cryptoToCrypto"
}

export type OrderWallet = {
  type: string;
  value: string;
};

export type OrderClient =
  | {
      id: Types.ObjectId;
    }
  | {
      name: string;
      phone: string;
      email: string;
    };
