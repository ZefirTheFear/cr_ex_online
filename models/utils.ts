export enum UserStatus {
  user = "user",
  observer = "observer",
  admin = "admin"
}

export enum OrderStatus {
  init = "init",
  withFullData = "withFullData",
  confirmedByUser = "confirmedByUser",
  confirmedByObserver = "confirmedByObserver",
  closed = "closed"
}

export enum OperationType {
  cryptoToFiat = "cryptoToFiat",
  fiatToCrypto = "fiatToCrypto",
  cryptoToCrypto = "cryptoToCrypto"
}
