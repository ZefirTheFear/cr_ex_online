import classes from "./InvalidFeedback.module.scss";

interface IInvalidFeedbackProps {
  msg: string;
}

const InvalidFeedback: React.FC<IInvalidFeedbackProps> = ({ msg }) => {
  return (
    <div key={msg} className={classes["invalid-feedback"]}>
      {msg}
    </div>
  );
};

export default InvalidFeedback;
