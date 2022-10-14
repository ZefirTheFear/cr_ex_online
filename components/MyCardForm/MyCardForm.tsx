import React from "react";

import "./MyCardForm.module.scss";

interface MyCardFormProps {
  setCurrentFormStep: () => void;
}

const MyCardForm: React.FC<MyCardFormProps> = ({ setCurrentFormStep }) => {
  return <div>MyCardForm</div>;
};

export default MyCardForm;
