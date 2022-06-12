import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useAppSelector } from "../../utils/ts/hooks";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const currentLanguage = useAppSelector((state) => state.lang.currentLanguage);

  const isMount = useRef(false);

  const router = useRouter();

  useEffect(() => {
    console.log(isMount.current);
    if (isMount.current) {
      console.log(isMount.current);
      router.push({
        pathname: router.pathname,
        query: { lang: currentLanguage.name }
      });
    }
    isMount.current = true;
  }, [currentLanguage]);

  return <>{props.children}</>;
};

export default Layout;
