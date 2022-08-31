import React, { useCallback, useState } from "react";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

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
}

const AuthInputGroup = React.forwardRef<HTMLInputElement, AuthInputGroupProps>(
  ({ title, type, placeholder }, ref) => {
    const [isShownPassword, setIsShownPassword] = useState(false);

    const toggleIsShownPassword = useCallback(() => {
      setIsShownPassword((prevState) => !prevState);
    }, []);

    return (
      <div className={classes["auth-input-group"]}>
        <label className={classes["auth-input-group__label"]}>{title}:</label>
        <div className={classes["auth-input-group__input-container"]}>
          <input
            className={classes["auth-input-group__input"]}
            type={
              type === AuthInputGroupType.password
                ? isShownPassword
                  ? AuthInputGroupType.text
                  : AuthInputGroupType.password
                : type
            }
            placeholder={placeholder}
            ref={ref}
          />
          {type === AuthInputGroupType.password && (
            <span
              className={classes["auth-input-group__toggler-password-visibility"]}
              onClick={toggleIsShownPassword}
            >
              {isShownPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          )}
        </div>
      </div>
    );
  }
);

AuthInputGroup.displayName = "AuthInputGroup";

export default AuthInputGroup;
