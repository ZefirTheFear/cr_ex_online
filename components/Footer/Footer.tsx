import classes from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__inner}>
        <div>footer1</div>
        <br />
        <div>footer2</div>
        <br />
        <div>footer3</div>
        <br />
        <div>footer4</div>
        <br />
        <div>footer5</div>
      </div>
    </footer>
  );
};

export default Footer;
