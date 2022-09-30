import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import { IEditUserInputErrors } from "../../utils/ts/validations";

import classes from "./Profile.module.scss";
import cloneDeep from "clone-deep";

enum EditState {
  none,
  editName,
  editEmail,
  editPhone,
  editPassword
}

enum Field {
  name = "name",
  email = "email",
  phone = "phone",
  password = "password"
}

enum EditUserInputFieldName {
  name = "name",
  email = "email",
  phone = "phone",
  currentPassword = "currentPassword",
  newPassword = "newPassword"
}

const Profile: React.FC = () => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const { data: session } = useSession();

  const router = useRouter();
  const language = router.query.lang as Languages;

  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordInput = useRef<HTMLInputElement>(null);

  const [inputErrors, setInputErrors] = useState<IEditUserInputErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [editState, setEditState] = useState<EditState>(EditState.none);

  const userData = useMemo(() => {
    if (!session) {
      return null;
    }
    return [
      {
        id: Field.name,
        title: language === Languages.en ? "Name" : language === Languages.ua ? "Ім'я" : "Имя",
        content: session.user.name
      },
      {
        id: Field.email,
        title: "Email",
        content: session.user.email
      },
      {
        id: Field.phone,
        title: language === Languages.en ? "Phone" : "Телефон",
        content: session.user.phone
      },
      {
        id: Field.password,
        title: language === Languages.en ? "Password" : "Пароль",
        content: "********"
      }
    ];
  }, [language, session]);

  const focusInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newErrors = cloneDeep(inputErrors);
      const fieldName = e.target.name as EditUserInputFieldName;
      delete newErrors[fieldName];
      setInputErrors(newErrors);
    },
    [inputErrors]
  );

  const changeEditState = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.getAttribute("data-id") as Field;
    switch (id) {
      case Field.name:
        setEditState(EditState.editName);
        break;
      case Field.email:
        setEditState(EditState.editEmail);
        break;
      case Field.phone:
        setEditState(EditState.editPhone);
        break;
      case Field.password:
        setEditState(EditState.editPassword);
        break;

      default:
        break;
    }
  }, []);

  const cleanEditState = useCallback(() => {
    setEditState(EditState.none);
  }, []);

  const changeUserName = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO
  }, []);

  const changeUserEmail = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO
  }, []);

  const changeUserPhone = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO
  }, []);

  const changeUserPassword = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO
  }, []);

  useEffect(() => {
    switch (editState) {
      case EditState.editName:
        if (nameInput.current && session) {
          nameInput.current.value = session.user.name;
        }
        break;
      case EditState.editEmail:
        if (emailInput.current && session) {
          emailInput.current.value = session.user.email;
        }
        break;
      case EditState.editPhone:
        if (phoneInput.current && session) {
          phoneInput.current.value = session.user.phone;
        }
        break;

      default:
        break;
    }
  }, [editState, session]);

  return (
    <>
      {!userData && <BlockSpinner />}
      <div className={classes.profile}>
        <div className={classes.profile__inner}>
          <h2 className={classes.profile__heading}>
            {language === Languages.en
              ? "My profile"
              : language === Languages.ua
              ? "Мій профіль"
              : "Мой профиль"}
          </h2>
          {editState === EditState.none && (
            <div className={classes["profile__user-data"]}>
              {userData &&
                userData.map((userDataItem) => (
                  <div className={classes["profile__user-data-card"]} key={userDataItem.title}>
                    <div className={classes["profile__user-data-item"]}>
                      <div className={classes["profile__user-data-item-title"]}>
                        {userDataItem.title}
                      </div>
                      <div className={classes["profile__user-data-item-content"]}>
                        {userDataItem.content}
                      </div>
                    </div>
                    <div
                      className={classes["profile__user-data-edit"]}
                      data-id={userDataItem.id}
                      onClick={changeEditState}
                    >
                      <FaEdit />
                    </div>
                  </div>
                ))}
            </div>
          )}
          {editState === EditState.editName && (
            <form className={classes["profile__edit-form"]} onSubmit={changeUserName} noValidate>
              <AuthInputGroup
                title={
                  language === Languages.en ? "Name" : language === Languages.ua ? "Ім'я" : "Имя "
                }
                type={AuthInputGroupType.text}
                placeholder={
                  language === Languages.en
                    ? "Enter your new name"
                    : language === Languages.ua
                    ? "Введіть ваше нове ім'я"
                    : "Введите ваше новое имя"
                }
                name={EditUserInputFieldName.name}
                errors={inputErrors.name ? inputErrors.name : null}
                ref={nameInput}
                onFocus={focusInput}
              />
              <button type="submit" className={classes["profile__save-btn"]}>
                {language === Languages.en
                  ? "Save"
                  : language === Languages.ua
                  ? "Зберегти"
                  : "Сохранить"}
              </button>
            </form>
          )}
          {editState === EditState.editEmail && (
            <form className={classes["profile__edit-form"]} onSubmit={changeUserEmail} noValidate>
              <AuthInputGroup
                title="Email"
                type={AuthInputGroupType.email}
                placeholder={
                  language === Languages.en
                    ? "Enter your new email"
                    : language === Languages.ua
                    ? "Введіть ваш новий email"
                    : "Введите ваш новый email"
                }
                name={EditUserInputFieldName.email}
                errors={inputErrors.email ? inputErrors.email : null}
                onFocus={focusInput}
                ref={emailInput}
              />
              <button type="submit" className={classes["profile__save-btn"]}>
                {language === Languages.en
                  ? "Save"
                  : language === Languages.ua
                  ? "Зберегти"
                  : "Сохранить"}
              </button>
            </form>
          )}
          {editState === EditState.editPhone && (
            <form className={classes["profile__edit-form"]} onSubmit={changeUserPhone} noValidate>
              <AuthInputGroup
                title={language === Languages.en ? "Phone number" : "Телефон"}
                type={AuthInputGroupType.tel}
                placeholder={
                  language === Languages.en
                    ? "Enter your new phone number"
                    : language === Languages.ua
                    ? "Введіть ваш новий телефон"
                    : "Введите ваш новый телефон"
                }
                name={EditUserInputFieldName.phone}
                errors={inputErrors.phone ? inputErrors.phone : null}
                ref={phoneInput}
                onFocus={focusInput}
              />
              <button type="submit" className={classes["profile__save-btn"]}>
                {language === Languages.en
                  ? "Save"
                  : language === Languages.ua
                  ? "Зберегти"
                  : "Сохранить"}
              </button>
            </form>
          )}
          {editState === EditState.editPassword && (
            <form
              className={classes["profile__edit-form"]}
              onSubmit={changeUserPassword}
              noValidate
            >
              <div className={classes["profile__input-with-mb"]}>
                <AuthInputGroup
                  title={
                    language === Languages.en
                      ? "Current Password"
                      : language === Languages.ua
                      ? "Поточний пароль"
                      : "Текущий пароль"
                  }
                  type={AuthInputGroupType.password}
                  placeholder={
                    language === Languages.en
                      ? "Enter your current password"
                      : language === Languages.ua
                      ? "Введіть ваш поточний пароль"
                      : "Введите ваш текущий пароль"
                  }
                  name={EditUserInputFieldName.currentPassword}
                  errors={inputErrors.currentPassword ? inputErrors.currentPassword : null}
                  ref={currentPasswordInput}
                  onFocus={focusInput}
                />
              </div>
              <AuthInputGroup
                title={
                  language === Languages.en
                    ? "New Password"
                    : language === Languages.ua
                    ? "Новий пароль"
                    : "Новый пароль"
                }
                type={AuthInputGroupType.password}
                placeholder={
                  language === Languages.en
                    ? "Enter your new password"
                    : language === Languages.ua
                    ? "Введіть ваш новий пароль"
                    : "Введите ваш новый пароль"
                }
                name={EditUserInputFieldName.newPassword}
                errors={inputErrors.newPassword ? inputErrors.newPassword : null}
                ref={newPasswordInput}
                onFocus={focusInput}
              />
              <button type="submit" className={classes["profile__save-btn"]}>
                {language === Languages.en
                  ? "Save"
                  : language === Languages.ua
                  ? "Зберегти"
                  : "Сохранить"}
              </button>
            </form>
          )}
          {editState !== EditState.none && (
            <div className={classes["profile__cancel-edit-state"]} onClick={cleanEditState}>
              {language === Languages.en
                ? "Cancel"
                : language === Languages.ua
                ? "Відмінити"
                : "Отменить"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
