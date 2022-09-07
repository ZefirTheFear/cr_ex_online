import React, { useCallback, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import classes from "./AuthInputGroup.module.scss";

export enum AuthInputGroupType {
  email = "email",
  password = "password",
  text = "text",
  tel = "tel"
}

interface AuthInputGroupProps {
  title: string;
  type: AuthInputGroupType;
  placeholder: string;
  name: string;
  errors: string[] | null;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const AuthInputGroup = React.forwardRef<HTMLInputElement, AuthInputGroupProps>(
  ({ title, type, placeholder, name, errors, onFocus }, ref) => {
    const [isShownPassword, setIsShownPassword] = useState(false);

    const toggleIsShownPassword = useCallback(() => {
      setIsShownPassword((prevState) => !prevState);
    }, []);

    return (
      <div className={classes["auth-input-group"]}>
        <label className={classes["auth-input-group__label"]}>{title}:</label>
        <div className={classes["auth-input-group__input-container"]}>
          <input
            className={
              `${classes["auth-input-group__input"]}` +
              (errors ? ` ${classes["auth-input-group__input_invalid"]}` : ``)
            }
            type={
              type === AuthInputGroupType.password
                ? isShownPassword
                  ? AuthInputGroupType.text
                  : AuthInputGroupType.password
                : type
            }
            placeholder={placeholder}
            name={name}
            ref={ref}
            autoComplete="off"
            onFocus={onFocus}
          />
          {type === AuthInputGroupType.password && (
            <span
              className={
                `${classes["auth-input-group__toggler-password-visibility"]}` +
                (errors
                  ? ` ${classes["auth-input-group__toggler-password-visibility_invalid-input"]}`
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

AuthInputGroup.displayName = "AuthInputGroup";

export default AuthInputGroup;
