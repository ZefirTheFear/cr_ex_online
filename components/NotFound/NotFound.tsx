import Link from "next/link";
import { HiHome } from "react-icons/hi";

import Logo from "../../assets/logo/logo_full.svg";
import Wtf from "../../assets/404/wtf.svg";

import classes from "./NotFound.module.scss";

const NotFound: React.FC = () => {
  return (
    <div className={classes["not-found"]}>
      <div className={classes["not-found__inner"]}>
        <header className={classes["not-found__header"]}>
          <div className={classes["not-found__logo"]}>
            <Link href={`/ua`}>
              <a>
                <Logo />
              </a>
            </Link>
          </div>
        </header>
        <div className={classes["not-found__content"]}>
          <div className={classes["not-found__img-container"]}>
            <Wtf />
          </div>
          <h1 className={classes["not-found__heading"]}>oops...</h1>
          <div className={classes["not-found__link-container"]}>
            <Link href={`/ua`}>
              <a>
                <button className={classes["not-found__home-btn"]}>
                  <HiHome />
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
