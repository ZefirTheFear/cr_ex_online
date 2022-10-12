import { Session } from "next-auth";
import { Languages } from "./../../models/language";

type Action = "action";

export enum ExchangeFormStep {
  userData = "userData",
  userWallet = "userWallet",
  payment = "payment",
  waiting = "waiting"
}

interface Step {
  title: string;
  isActive: boolean;
  isDone: boolean;
}

interface ExchangeFormState {
  currentStep: ExchangeFormStep;
  steps: Step[];
}

export const initFn = (session: Session | null): ExchangeFormState => {
  return {
    currentStep: session ? ExchangeFormStep.userWallet : ExchangeFormStep.userData,
    steps: [
      ...(!session
        ? [{ title: "user data", isActive: !session ? true : false, isDone: false }]
        : []),
      { title: "wallet/card", isActive: session ? true : false, isDone: false },
      { title: "payment", isActive: false, isDone: false },
      { title: "waiting", isActive: false, isDone: false }
    ]
  };
};

export const reducer = (state: ExchangeFormState, action: Action): ExchangeFormState => {
  switch (action) {
    case "action":
      return { ...state };

    default:
      return state;
  }
};
