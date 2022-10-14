import { Languages } from "../../models/language";

import classes from "./Footer.module.scss";

interface FooterProps {
  lang: Languages;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__inner}>
        <h6 className={classes.footer__heading}>Heading</h6>
        <div className={classes.footer__item}>footer1</div>
        <div className={classes.footer__item}>footer2</div>
        <div className={classes.footer__item}>footer3</div>
        <div className={classes.footer__item}>footer4</div>
        <div className={classes.footer__item}>footer5</div>
      </div>
    </footer>
  );
};

export default Footer;
