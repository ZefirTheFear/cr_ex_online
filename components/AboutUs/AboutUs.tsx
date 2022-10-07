import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import classes from "./AboutUs.module.scss";

const AboutUs = () => {
  const router = useRouter();

  const [canILeave, setCanILeave] = useState(false);

  const onRouteChangeStart = useCallback(
    (url: string) => {
      console.log("leavePageHandler");
      console.log("url: ", url);
      const currentUrl = router.asPath;
      console.log("currentUrl: ", currentUrl);
      console.log("router: ", router);
      if (url !== currentUrl) {
        const areYouSure = window.confirm("are you sure?");
        if (!areYouSure) {
          console.log("stop leaving");
          history.forward();
          throw "Abort route change by user's confirmation.";
        }
      }
      // window.location.href = currentUrl;
      // window.history.replaceState(null, document.title, currentUrl);
      // router.events.emit("routeChangeError");
    },
    [router]
  );

  // const onHashChangeStart = useCallback((url: string) => {
  //   console.log("hashChangeStart_url: ", url);
  // }, []);

  const onBeforeHistoryChange = useCallback((url: string) => {
    console.log("beforeHistoryChange_url: ", url);
    throw "stop_beforeHistoryChange";
  }, []);

  const handleWindowClose = useCallback((e: BeforeUnloadEvent) => {
    const cIL = window.confirm("R U Sure?");
    if (!cIL) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    console.log("did mount");
    // router.events.on("beforeHistoryChange", onBeforeHistoryChange);
    // router.events.on("hashChangeStart", onHashChangeStart);
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", onRouteChangeStart);

    return () => {
      console.log("before unmount");
      // router.events.off("beforeHistoryChange", onBeforeHistoryChange);
      // router.events.off("hashChangeStart", onHashChangeStart);
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [handleWindowClose, onRouteChangeStart, router.events]);

  // useEffect(() => {
  //   // console.log("did mount");
  //   router.beforePopState(({ url, as, options }) => {
  //     console.log("beforePopState");
  //     console.log("url: ", url);
  //     console.log("as: ", as);
  //     console.log("options: ", options);
  //     // const currentUrl = router.asPath;
  //     // console.log("currentUrl: ", currentUrl);
  //     if (!canILeave) {
  //       console.log("wait");
  //       history.forward();
  //       return false;
  //     } else {
  //       console.log("bye");
  //       return true;
  //     }
  //   });
  //   return () => {
  //     // console.log("before unmount");
  //   };
  // }, [canILeave, router]);

  // const clg = useCallback((event: BeforeUnloadEvent) => {
  //   console.log("beforeunload: ", event);
  //   // event.preventDefault();
  // }, []);

  // useEffect(() => {
  //   // window.addEventListener("beforeunload", (event: BeforeUnloadEvent) => {
  //   //   console.log("beforeunload: ", event);
  //   // });
  //   window.addEventListener("popstate", (event) => {
  //     console.log("popstate: ", event);
  //   });
  //   return () => {
  //     // window.removeEventListener("beforeunload", (event: BeforeUnloadEvent) => clg(event));
  //   };
  // }, []);

  // const onhashchange = useCallback((event: HashChangeEvent) => {
  //   console.log("hashchange: ", event);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("hashchange", (event) => {
  //     onhashchange(event);
  //   });
  // }, [onhashchange]);

  return (
    <div className={classes["about-us"]}>
      <span>about us</span>
      <input type="text" />
    </div>
  );
};

export default AboutUs;
