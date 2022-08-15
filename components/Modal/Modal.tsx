import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import classes from "./Modal.module.scss";

interface IModalProps {
  msg: string;
  closeModal: () => void;
}

const Modal: React.FC<IModalProps> = ({ msg, closeModal }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    setMounted(true);
    return () => {
      document.documentElement.style.overflow = "";
      setMounted(false);
    };
  }, []);

  return mounted
    ? createPortal(
        <div className={classes.modal}>
          <div className={classes.modal__msg}>{msg}</div>
          <div className={classes["modal__btn-group"]}>
            <button onClick={closeModal}>Ok</button>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default Modal;
