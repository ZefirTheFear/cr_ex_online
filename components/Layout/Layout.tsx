import React from "react";

// import Header from "../Header/Header";
// import MenuMobile from "../MenuMobile/MenuMobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      {/* <Header />
      <MenuMobile /> */}
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
