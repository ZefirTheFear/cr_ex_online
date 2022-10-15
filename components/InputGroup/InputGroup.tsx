import React, { useCallback, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import classes from "./InputGroup.module.scss";

export enum InputGroupType {
  email = "email",
  password = "password",
  text = "text",
  tel = "tel"
}

interface InputGroupProps {
  title: string;
  type: InputGroupType;
  placeholder: string;
  name: string;
  errors: string[] | null;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ title, type, placeholder, name, errors, onFocus }, ref) => {
    const [isShownPassword, setIsShownPassword] = useState(false);

    const toggleIsShownPassword = useCallback(() => {
      setIsShownPassword((prevState) => !prevState);
    }, []);

    return (
      <div className={classes["input-group"]}>
        <label className={classes["input-group__label"]}>{title}:</label>
        <div className={classes["input-group__input-container"]}>
          <input
            className={
              `${classes["input-group__input"]}` +
              (errors ? ` ${classes["input-group__input_invalid"]}` : ``)
            }
            type={
              type === InputGroupType.password
                ? isShownPassword
                  ? InputGroupType.text
                  : InputGroupType.password
                : type
            }
            placeholder={placeholder}
            name={name}
            ref={ref}
            autoComplete="off"
            onFocus={onFocus}
          />
          {type === InputGroupType.password && (
            <span
              className={
                `${classes["input-group__toggler-password-visibility"]}` +
                (errors
                  ? ` ${classes["input-group__toggler-password-visibility_invalid-input"]}`
                  : ``)
              }
              onClick={toggleIsShownPassword}
            >
              {isShownPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          )}
        </div>
        {errors && errors.map((msg) => <InvalidFeedback key={msg} msg={msg} />)}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";

export default InputGroup;
