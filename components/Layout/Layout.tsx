import classes from "./Layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return <div className={classes.page}>{props.children}</div>;
};

export default Layout;
