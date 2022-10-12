import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiHome } from "react-icons/hi";

import Logo from "../../assets/logo/logo_full.svg";
import Wtf from "../../assets/404/wtf.svg";

import { Languages } from "../../models/language";

import classes from "./NotFound.module.scss";

const NotFound: React.FC = () => {
  const router = useRouter();
  let language = router.query.lang as string;

  // if (Object.values(Languages).includes(language)) {
  //   console.log("yes: ", language);
  // } else {
  //   console.log("no: ", language);
  // }

  if (!(language in Languages)) {
    language = Languages.ua;
  }

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
        <div className={classes["not-found"]}>
          <div className={classes["not-found__inner"]}>
            <header className={classes["not-found__header"]}>
              <div className={classes["not-found__logo"]}>
                <Link href={`/${encodeURIComponent(language)}/`}>
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
              <h1 className={classes["not-found__heading"]}>
                {language === Languages.en ? "oops..." : "упс..."}
              </h1>
              <div className={classes["not-found__link-container"]}>
                <Link href={`/${encodeURIComponent(language)}/`}>
                  <a>
                    <button className={classes["not-found__home-btn"]}>
                      <HiHome />
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default NotFound;
