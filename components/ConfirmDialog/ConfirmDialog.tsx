import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import classes from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  msg: string;
  confirm: () => void;
  reject: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ msg, confirm, reject }) => {
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
        <div className={classes["confirm-dialog"]}>
          <div className={classes["confirm-dialog__modal"]}>
            <div className={classes["confirm-dialog__msg"]}>{msg}</div>
            <div className={classes["confirm-dialog__btn-container"]}>
              <button onClick={reject}>no</button>
              <button onClick={confirm}>yes</button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default ConfirmDialog;
