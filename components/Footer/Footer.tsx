import classes from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__inner}>FOOTER</div>
    </footer>
  );
};

export default Footer;
