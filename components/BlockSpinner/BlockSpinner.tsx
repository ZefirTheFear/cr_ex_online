import { useEffect } from "react";

import SVGSpinner from "../../assets/spinner/spinner.svg";

import classes from "./BlockSpinner.module.scss";

const LoadingSpinner: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className={classes.spinner}>
      <SVGSpinner />
    </div>
  );
};

export default LoadingSpinner;
