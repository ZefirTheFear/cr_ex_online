import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import Modal from "../Modal/Modal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import NotFound from "../NotFound/NotFound";
import PersonalDataForm from "../EFPersonalDataForm/EFPersonalDataForm";

import { Languages } from "../../models/language";
import { IOrder } from "../../models/mongooseSchemas/order";
import { OperationType } from "../../models/utils";

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
  const { data: session } = useSession();

  const [currentFormStep, setCurrentFormStep] = useState(
    session ? ExchangeFormStep.userWallet : ExchangeFormStep.userData
  );
  const [order, setOrder] = useState<IOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [orderNotFound, setOrderNotFound] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const formSteps: Step[] = useMemo(() => {
    if (!order) {
      return [];
    }
    return [
      ...(!session
        ? [
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
            }
          ]
        : []),
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
  }, [currentFormStep, language, order, session]);

  const proceedPersonalDataForm = useCallback(() => {
    setCurrentFormStep(ExchangeFormStep.userWallet);
  }, []);

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

  const onRouteChangeStart = useCallback(
    (url: string) => {
      console.log("leavePageHandler");
      console.log("url: ", url);
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
              {currentFormStep === ExchangeFormStep.userWallet && <div>WALLET</div>}
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
