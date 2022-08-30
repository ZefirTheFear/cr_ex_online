import AuthForm from "../AuthForm/AuthForm";

import classes from "./AuthSection.module.scss";

const AuthSection: React.FC = () => {
  return (
    <section className={classes["auth-section"]}>
      <div className={classes["auth-section__inner"]}>
        <AuthForm />
      </div>
    </section>
  );
};

export default AuthSection;
