import { useCallback, useState, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import Modal from "../Modal/Modal";
import NotFound from "../NotFound/NotFound";

import { Languages } from "../../models/language";
import { IOrder } from "../../models/mongooseSchemas/order";

import { reducer, initFn, ExchangeFormStep } from "./reducer";

import classes from "./ExchangeForm.module.scss";

interface IExchangeForm {
  orderId: string;
}

const ExchangeForm: React.FC<IExchangeForm> = ({ orderId }) => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const router = useRouter();
  const language = router.query.lang as Languages;
  const { data: session } = useSession();

  const [exchangeFormState, dispatch] = useReducer(reducer, session, initFn);

  const [order, setOrder] = useState<IOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);

  const userData = <div>USER DATA</div>;
  const wallet = <div>WALLET</div>;
  const payment = <div>PAYMENT</div>;
  const waiting = <div>WAITING</div>;

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch("/api/orders/get-order-data", {
        method: "GET",
        headers: {
          "order-id": orderId
        },
        signal: controller.signal
      });
      console.log(response);

      if (response.status === 404) {
        setOrderNotFound(true);
        return setIsLoading(false);
      }

      if (response.status !== 200) {
        setIsSomethingWentWrong(true);
        return setIsLoading(false);
      }

      const responseData = (await response.json()) as { orderData: IOrder };
      console.log(responseData);
      setOrder(responseData.orderData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return setIsSomethingWentWrong(true);
    }
  }, [controller.signal, orderId]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  useEffect(() => {
    fetchOrder();

    return () => {
      controller.abort();
    };
  }, [controller, fetchOrder]);

  return (
    <>
      {isLoading && <BlockSpinner />}
      {orderNotFound && <NotFound />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "Something went wrong. Try again later"
              : language === Languages.ua
              ? "Щось пішло не так. Cпробуйте пізніше"
              : "Что-то пошло не так. Попробуйте позже"
          }
        />
      )}
      <div className={classes["exchange-form"]}>
        <div className={classes["exchange-form__inner"]}>
          <div className={classes["exchange-form__container"]}>
            <div className={classes["exchange-form__steps"]}>
              {exchangeFormState.steps.map((step, index) => (
                <div key={step.title}>
                  <span>{index + 1}: </span>
                  <span>{step.title}</span>
                  <span>{step.isActive && "-active"}</span>
                </div>
              ))}
            </div>
            <div className={classes["exchange-form__current-step"]}>
              {exchangeFormState.currentStep === ExchangeFormStep.userData && userData}
              {exchangeFormState.currentStep === ExchangeFormStep.userWallet && wallet}
              {exchangeFormState.currentStep === ExchangeFormStep.payment && payment}
              {exchangeFormState.currentStep === ExchangeFormStep.waiting && waiting}
            </div>
          </div>
          {/* <div>Exchange Form : {orderId}</div>
        <div>Type : {order?.type}</div>
        <div>currencyFromCustomer : {order?.initData.currencyFromCustomer.id}</div>
        <div>amountFromCustomer : {order?.initData.amountFromCustomer}</div>
        <div>currencyToCustomer : {order?.initData.currencyToCustomer.id}</div>
        <div>amountToCustomer : {order?.initData.amountToCustomer}</div>
        <br /> */}
        </div>
      </div>
    </>
  );
};

export default ExchangeForm;
