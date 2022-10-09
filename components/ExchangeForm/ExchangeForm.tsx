import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import PageSpinner from "../PageSpinner/PageSpinner";
import Modal from "../Modal/Modal";

import { Languages } from "../../models/language";

import classes from "./ExchangeForm.module.scss";
import { IOrder } from "../../models/mongooseSchemas/order";

enum ExchangeFormStep {
  userData = "userData",
  userWallet = "userWallet",
  payment = "payment",
  waiting = "waiting"
}

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

  const [order, setOrder] = useState<IOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [formStep, setFormStep] = useState(() =>
    !session ? ExchangeFormStep.userData : ExchangeFormStep.userWallet
  );

  const formSteps = useMemo(() => {
    return [
      ...(!session ? [{ title: "user data" }] : []),
      { title: "wallet/card" },
      { title: "payment" },
      { title: "waiting" }
    ];
  }, [session]);

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

      if (response.status !== 200) {
        setIsLoading(false);
        return setIsSomethingWentWrong(true);
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
      {isLoading && <PageSpinner />}
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
        <div>Exchange Form : {orderId}</div>
        <div>Type : {order?.type}</div>
        <div>currencyFromCustomer : {order?.initData.currencyFromCustomer.id}</div>
        <div>amountFromCustomer : {order?.initData.amountFromCustomer}</div>
        <div>currencyToCustomer : {order?.initData.currencyToCustomer.id}</div>
        <div>amountToCustomer : {order?.initData.amountToCustomer}</div>
        <br />
        <div>
          {formSteps.map((step, index) => (
            <div key={step.title}>
              <span>{index + 1}: </span>
              <span>{step.title}</span>
            </div>
          ))}
        </div>
        <div>
          {formStep === ExchangeFormStep.userData && userData}
          {formStep === ExchangeFormStep.userWallet && wallet}
          {formStep === ExchangeFormStep.payment && payment}
          {formStep === ExchangeFormStep.waiting && waiting}
        </div>
      </div>
    </>
  );
};

export default ExchangeForm;
