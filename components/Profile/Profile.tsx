import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";

import BlockSpinner from "../BlockSpinner/BlockSpinner";
import PageSpinner from "../PageSpinner/PageSpinner";
import Modal from "../Modal/Modal";
import AuthInputGroup, { AuthInputGroupType } from "../AuthInputGroup/AuthInputGroup";

import { Languages } from "../../models/language";
import {
  editUserDataValidation,
  IEditUserData,
  IEditUserInputErrors
} from "../../utils/ts/validations";

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
  newName = "newName",
  newEmail = "newEmail",
  newPhone = "newPhone",
  currentPassword = "currentPassword",
  newPassword = "newPassword"
}

const Profile: React.FC = () => {
  const controller = useMemo(() => {
    return new AbortController();
  }, []);

  const { data: session } = useSession();
  // console.log("session: ", session);

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
    setInputErrors({});
  }, []);

  const changeUserData = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!session) {
        return;
      }

      let changeUserData: IEditUserData;
      let editUrl: string;

      if (editState === EditState.editName && nameInput.current) {
        changeUserData = {
          currentEmail: session.user.email,
          newName: nameInput.current.value.trim(),
          language: language
        };
        editUrl = "/api/profile/edit-user-name";
      } else if (editState === EditState.editPhone && phoneInput.current) {
        changeUserData = {
          currentEmail: session.user.email,
          newPhone: phoneInput.current.value.trim(),
          language: language
        };
        editUrl = "/api/profile/edit-user-phone";
      } else if (editState === EditState.editEmail && emailInput.current) {
        changeUserData = {
          currentEmail: session.user.email,
          newEmail: emailInput.current.value.toLowerCase().trim(),
          language: language
        };
        editUrl = "/api/profile/edit-user-email";
      } else if (
        editState === EditState.editPassword &&
        currentPasswordInput.current &&
        newPasswordInput.current
      ) {
        changeUserData = {
          currentEmail: session.user.email,
          currentPassword: currentPasswordInput.current.value.trim(),
          newPassword: newPasswordInput.current.value.trim(),
          language: language
        };
        editUrl = "/api/profile/edit-user-password";
      } else {
        return;
      }

      const changeUserDataInputErrors = editUserDataValidation(changeUserData);
      console.log("changeUserDataInputErrors: ", changeUserDataInputErrors);
      if (changeUserDataInputErrors) {
        return setInputErrors(changeUserDataInputErrors);
      }

      setIsLoading(true);
      try {
        const response = await fetch(editUrl, {
          method: "PATCH",
          body: JSON.stringify(changeUserData),
          headers: {
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });
        console.log(response);

        if (response.status === 422) {
          const data = (await response.json()) as { inputErrors: IEditUserInputErrors };
          setInputErrors(data.inputErrors);
          setIsLoading(false);
          return;
        }

        if (response.status === 503) {
          const data = (await response.json()) as { message: string };
          console.log(data);
          setIsSomethingWentWrong(true);
          setIsLoading(false);
          return;
        }

        if (response.status === 200) {
          // console.log("new ses");
          // if (changeUserData.newName) {
          //   session.user.name = changeUserData.newName;
          // }

          setIsSuccess(true);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log(data);
        setIsLoading(false);
        return;
      } catch (error) {
        console.log("error: ", error);
        setIsSomethingWentWrong(true);
        setIsLoading(false);
        return;
      }
    },
    [controller.signal, editState, language, session]
  );

  const closeSWWModal = useCallback(() => {
    setIsSomethingWentWrong(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setEditState(EditState.none);
    setIsSuccess(false);
    // if (session) {
    //   console.log("new ses");
    //   session.user.name = "qwe";
    // }
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

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

  return (
    <>
      {isLoading && <PageSpinner />}
      {isSomethingWentWrong && (
        <Modal
          closeModal={closeSWWModal}
          msg={
            language === Languages.en
              ? "Something went wrong. Try again later"
              : language === Languages.ua
              ? "Щось пішло не так. Cпробуйте пізніше"
              : "Что-то пошло не так. Попробуйте позже"
          }
        />
      )}
      {isSuccess && (
        <Modal
          closeModal={closeSuccessModal}
          msg={
            language === Languages.en
              ? "The data has been successfully changed"
              : language === Languages.ua
              ? "Дані успішно змінено"
              : "Данные успешно изменены"
          }
        />
      )}
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

          {editState !== EditState.none && (
            <>
              <form className={classes["profile__edit-form"]} onSubmit={changeUserData} noValidate>
                {editState === EditState.editName && (
                  <AuthInputGroup
                    title={
                      language === Languages.en
                        ? "Name"
                        : language === Languages.ua
                        ? "Ім'я"
                        : "Имя "
                    }
                    type={AuthInputGroupType.text}
                    placeholder={
                      language === Languages.en
                        ? "Enter your new name"
                        : language === Languages.ua
                        ? "Введіть ваше нове ім'я"
                        : "Введите ваше новое имя"
                    }
                    name={EditUserInputFieldName.newName}
                    errors={inputErrors.newName ? inputErrors.newName : null}
                    ref={nameInput}
                    onFocus={focusInput}
                  />
                )}
                {editState === EditState.editEmail && (
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
                    name={EditUserInputFieldName.newEmail}
                    errors={inputErrors.newEmail ? inputErrors.newEmail : null}
                    onFocus={focusInput}
                    ref={emailInput}
                  />
                )}
                {editState === EditState.editPhone && (
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
                    name={EditUserInputFieldName.newPhone}
                    errors={inputErrors.newPhone ? inputErrors.newPhone : null}
                    ref={phoneInput}
                    onFocus={focusInput}
                  />
                )}
                {editState === EditState.editPassword && (
                  <>
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
                  </>
                )}
                <button type="submit" className={classes["profile__save-btn"]}>
                  {language === Languages.en
                    ? "Save"
                    : language === Languages.ua
                    ? "Зберегти"
                    : "Сохранить"}
                </button>
              </form>
              <div className={classes["profile__cancel-edit-state"]} onClick={cleanEditState}>
                {language === Languages.en
                  ? "Cancel"
                  : language === Languages.ua
                  ? "Відмінити"
                  : "Отменить"}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
