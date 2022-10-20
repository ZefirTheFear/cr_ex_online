import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import Modal from "../Modal/Modal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import NotFound from "../NotFound/NotFound";
import PersonalDataForm from "../EFPersonalDataForm/EFPersonalDataForm";
import UserWalletForm from "../EFUserWalletForm/EFUserWalletForm";

import { Languages } from "../../models/language";
import { IOrder } from "../../models/mongooseSchemas/order";
import { OperationType, OrderClient, OrderStatus } from "../../models/utils";

import classes from "./ExchangeForm.module.scss";

enum ExchangeFormStep {
  userData = 1,
  userWallet = 2,
  payment = 3,
  waiting = 4
}

interface Step {
  id: string;
  title: string;
  isActive: boolean;
  isDone: boolean;
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

  // const [currentFormStep, setCurrentFormStep] = useState(
  //   session ? ExchangeFormStep.userWallet : ExchangeFormStep.userData
  // );
  const [currentFormStep, setCurrentFormStep] = useState(ExchangeFormStep.userData);
  const [order, setOrder] = useState<IOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  // const [client, setClient] = useState<OrderClient>();
  // const [clientWallet, setClientWallet] = useState<OrderWallet>();

  const formSteps: Step[] = useMemo(() => {
    if (!order) {
      return [];
    }
    return [
      {
        id: "1",
        title:
          language === Languages.en
            ? "Personal Data"
            : language === Languages.ua
            ? "Особисті дані"
            : "Персональные данные",
        isActive: currentFormStep === ExchangeFormStep.userData,
        isDone: currentFormStep > ExchangeFormStep.userData
      },
      {
        id: "2",
        title:
          order.type === OperationType.cryptoToFiat
            ? language === Languages.en
              ? "My card"
              : language === Languages.ua
              ? "Моя картка"
              : "Моя карта"
            : language === Languages.en
            ? "My wallet"
            : language === Languages.ua
            ? "Мій гаманець"
            : "Мой кошелек",
        isActive: currentFormStep === ExchangeFormStep.userWallet,
        isDone: currentFormStep > ExchangeFormStep.userWallet
      },
      {
        id: "3",
        title: language === Languages.en ? "Payment" : "Оплата",
        isActive: currentFormStep === ExchangeFormStep.payment,
        isDone: currentFormStep > ExchangeFormStep.payment
      },
      {
        id: "4",
        title:
          language === Languages.en
            ? "Waiting"
            : language === Languages.ua
            ? "Очікування"
            : "Ожидание",
        isActive: currentFormStep === ExchangeFormStep.waiting,
        isDone: false
      }
    ];
  }, [currentFormStep, language, order]);

  const proceedPersonalDataForm = useCallback(
    async (clientData: OrderClient) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/orders/set-client-data", {
          method: "PUT",
          body: JSON.stringify(clientData),
          headers: {
            "order-id": orderId,
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });
        console.log(response);

        if (response.status !== 200) {
          setIsSomethingWentWrong(true);
          return setIsLoading(false);
        }

        setCurrentFormStep(ExchangeFormStep.userWallet);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        return setIsSomethingWentWrong(true);
      }
    },
    [controller.signal, orderId]
  );

  const proceedClientWalletForm = useCallback(
    (wallet: string) => {
      if (!order) {
        return;
      }
      setCurrentFormStep(ExchangeFormStep.payment);
      // setClientWallet({ value: wallet, type: order.initData.currencyToCustomer.id });
    },
    [order]
  );

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
      if (responseData.orderData.status === OrderStatus.clientPersonalData) {
        setCurrentFormStep(ExchangeFormStep.userData);
      } else if (responseData.orderData.status === OrderStatus.clientWallet) {
        setCurrentFormStep(ExchangeFormStep.userWallet);
      } else if (responseData.orderData.status === OrderStatus.payment) {
        setCurrentFormStep(ExchangeFormStep.payment);
      } else {
        setCurrentFormStep(ExchangeFormStep.waiting);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return setIsSomethingWentWrong(true);
    }
  }, [controller.signal, orderId]);

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  const onRouteChangeStart = useCallback(
    (url: string) => {
      console.log("leavePageHandler");
      console.log("url: ", url);
      if (url.includes("register") || url.includes("login")) {
        return;
      }
      const currentUrl = router.asPath;
      console.log("currentUrl: ", currentUrl);
      const indexOfUrl = currentUrl.indexOf("order");
      const currentSubUrl = currentUrl.slice(indexOfUrl);
      const subUrl = url.slice(indexOfUrl);
      if (subUrl !== currentSubUrl) {
        setNewUrl(url);
        setIsDialogOpen(true);
        window.history.forward();
        // window.history.replaceState(null, document.title, currentUrl);
        // window.history.pushState({ page: history.length + 1 }, document.title, currentUrl);
        throw "Abort route change by user's confirmation.";
      }
    },
    [router]
  );

  const confirmRouteChange = useCallback(() => {
    router.events.off("routeChangeStart", onRouteChangeStart);
    setIsDialogOpen(false);
    router.replace(newUrl);
  }, [newUrl, onRouteChangeStart, router]);

  const rejectRouteChange = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [onRouteChangeStart, router.events]);

  useEffect(() => {
    fetchOrder();

    return () => {
      controller.abort();
    };
  }, [controller, fetchOrder]);

  if (order && order.status === OrderStatus.closed) {
    return <div>order is closed!</div>;
  }

  return (
    <>
      {isDialogOpen && (
        <ConfirmDialog
          msg={
            language === Languages.en
              ? "Are you sure you want to leave the page?"
              : language === Languages.ua
              ? "Ви впевнені, що хочете залишити сторінку?"
              : "Вы уверены, что хотите покинуть страницу?"
          }
          confirm={confirmRouteChange}
          reject={rejectRouteChange}
        />
      )}
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
              <ol className={classes["exchange-form__step-list"]}>
                {formSteps.map((step, index) => (
                  <li
                    className={
                      step.isActive
                        ? classes["exchange-form__step_active"]
                        : step.isDone
                        ? classes["exchange-form__step_done"]
                        : ""
                    }
                    key={step.title}
                  >
                    <span className={classes["exchange-form__step-order"]}>{index + 1} </span>
                    <span className={classes["exchange-form__step-title"]}>{step.title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={classes["exchange-form__current-step-form"]}>
              {currentFormStep === ExchangeFormStep.userData && (
                <PersonalDataForm proceed={proceedPersonalDataForm} />
              )}
              {currentFormStep === ExchangeFormStep.userWallet && order && (
                <UserWalletForm
                  operationType={order.type}
                  currency={order.initData.currencyToCustomer}
                  proceed={proceedClientWalletForm}
                />
              )}
              {currentFormStep === ExchangeFormStep.payment && <div>PAYMENT</div>}
              {currentFormStep === ExchangeFormStep.waiting && <div>WAITING</div>}
            </div>
          </div>
          {/* <div>Exchange Form : {orderId}</div>
          <div>Type : {order?.type}</div>
          <div>currencyFromCustomer : {order?.initData.currencyFromCustomer.id}</div>
          <div>amountFromCustomer : {order?.initData.amountFromCustomer}</div>
          <div>currencyToCustomer : {order?.initData.currencyToCustomer.id}</div>
          <div>amountToCustomer : {order?.initData.amountToCustomer}</div> */}
        </div>
      </div>
    </>
  );
};

export default ExchangeForm;
