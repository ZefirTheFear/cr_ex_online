import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import SVGSpinner from "../../assets/spinner/spinner.svg";

import classes from "./Spinner.module.scss";

const Spinner: React.FC = () => {
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
        <div className={classes.spinner}>
          <SVGSpinner />
        </div>,
        document.body
      )
    : null;
};

export default Spinner;
