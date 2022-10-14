import React from "react";

import AuthForm from "../AuthForm/AuthForm";

import "./PersonalDataForm.module.scss";

interface PersonalDataFormProps {
  proceed: () => void;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ proceed }) => {
  return (
    <div>
      <div>PersonalDataForm</div>
      <div>{/* <AuthForm /> */}</div>
    </div>
  );
};

export default PersonalDataForm;
