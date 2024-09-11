"use client";

import { useTranslation } from "@/app/_i18n/client";
import {
  emailConstraint,
  passwordConstraint,
} from "../../_components/input/constraints";
import Input from "../../_components/input/Input";
import Button from "../../_components/Button";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { BASE_URL, METHOD } from "@/utils/api";
import HttpStatus from "http-status-codes";
import Link from "next/link";

enum EmailSubmitErrorKeys {
  AlreadyRegistered = "emailAlreadyExistsError",
  RequiredField = "requiredFieldError",
}

enum PasswordSubmitErrorKeys {
  RequiredField = "requiredFieldError",
}

enum ConfirmPasswordSubmitErrorKeys {
  RequiredField = "requiredFieldError",
}

export default function Registration({
  params: { lng },
}: Readonly<{
  params: {
    lng: string;
  };
}>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const onEmailChange = getOnChange(setEmail);
  const onPasswordChange = getOnChange(setPassword);
  const onConfirmPasswordChange = getOnChange(setConfirmPassword);

  const isEmailSubmitError = getIsSubmitError(EmailSubmitErrorKeys, emailError);
  const isPasswordSubmitError = getIsSubmitError(
    PasswordSubmitErrorKeys,
    passwordError,
  );
  const isConfirmPasswordSubmitError = getIsSubmitError(
    ConfirmPasswordSubmitErrorKeys,
    confirmPasswordError,
  );

  const resetEmailSubmitErrorOnFocus = getResetSubmitErrorOnFocus(
    isEmailSubmitError,
    setEmailError,
  );
  const resetPasswordSubmitErrorOnFocus = getResetSubmitErrorOnFocus(
    isPasswordSubmitError,
    setPasswordError,
  );
  const resetConfirmPasswordSubmitErrorOnFocus = getResetSubmitErrorOnFocus(
    isConfirmPasswordSubmitError,
    setConfirmPasswordError,
  );

  const { t } = useTranslation(lng, "register");

  async function onSubmit() {
    if (!email) {
      setEmailError(t(EmailSubmitErrorKeys.RequiredField));
    }

    if (!password) {
      setPasswordError(t(PasswordSubmitErrorKeys.RequiredField));
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t(ConfirmPasswordSubmitErrorKeys.RequiredField));
    }

    if (
      !email ||
      !password ||
      !confirmPassword ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      return;
    }

    const response = await fetch(BASE_URL + "/signup/", {
      method: METHOD.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "dummy", email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorCode = error.code;

      switch (response.status) {
        case HttpStatus.CONFLICT:
          if (errorCode === "USER_ALREADY_REGISTERED") {
            setEmailError(t(EmailSubmitErrorKeys.AlreadyRegistered));
          }
          break;
        default:
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } else {
      const data = await response.json();
      console.log("Server response:", data);
    }
  }

  function getOnChange(setState: Dispatch<SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setState(e.target.value);
    };
  }

  function getIsSubmitError(SubmitErrorKeys: object, error: string) {
    return () => {
      return Object.values(SubmitErrorKeys).some(
        (errorKey) => t(errorKey) === error,
      );
    };
  }

  function getResetSubmitErrorOnFocus(
    isSubmitError: () => boolean,
    setError: Dispatch<SetStateAction<string>>,
  ) {
    return () => {
      if (isSubmitError()) setError("");
    };
  }

  useEffect(() => {
    interface ErrorInfo {
      value: string;
      error: string;
      setError: Dispatch<SetStateAction<string>>;
      constraint: string;
      errorKey: string;
    }

    function setErrorBasedOnValidation(errorInfo: ErrorInfo) {
      if (
        isEmailSubmitError() ||
        isPasswordSubmitError() ||
        isConfirmPasswordSubmitError()
      )
        return;

      function assertIsRegex(pattern: string): void {
        try {
          new RegExp(pattern);
        } catch (e) {
          throw new Error(`Invalid regex pattern: ${pattern}`);
        }
      }

      if (errorInfo.value) {
        try {
          assertIsRegex(errorInfo.constraint);
          const constraintRegex = new RegExp(errorInfo.constraint);
          errorInfo.setError(
            constraintRegex.test(errorInfo.value) ? "" : t(errorInfo.errorKey),
          );
        } catch (e) {
          if (e instanceof Error) {
            console.log(e.message);
          } else {
            throw new Error(
              "An unknown error occurred while validating the regex pattern.",
            );
          }
        }
      }
    }

    function validateConfirmPassword() {
      setConfirmPasswordError(
        confirmPassword === password ? "" : t("confirmPasswordError"),
      );
    }

    const errorInfoArr: ErrorInfo[] = [
      {
        value: email,
        error: emailError,
        setError: setEmailError,
        constraint: emailConstraint,
        errorKey: "emailFormatError",
      },
      {
        value: password,
        error: passwordError,
        setError: setPasswordError,
        constraint: passwordConstraint,
        errorKey: "passwordError",
      },
    ];

    errorInfoArr.forEach((info) => setErrorBasedOnValidation(info));
    validateConfirmPassword();
  }, [
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    t,
  ]);

  return (
    <div className="flex h-[calc(100vh-128px)] w-full justify-center items-center">
      <div className="flex flex-col w-1/6 items-center">
        <h1 className="dark:text-white text-lg font-bold text-center py-5">
          {t("title")}
        </h1>
        <Input
          type="text"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          onChange={onEmailChange}
          onFocus={resetEmailSubmitErrorOnFocus}
          error={emailError}
        />
        <Input
          type="password"
          label={t("password")}
          onChange={onPasswordChange}
          onFocus={resetPasswordSubmitErrorOnFocus}
          error={passwordError}
        />
        <Input
          type="password"
          label={t("confirmPassword")}
          onChange={onConfirmPasswordChange}
          onFocus={resetConfirmPasswordSubmitErrorOnFocus}
          error={confirmPasswordError}
        />
        <div className="flex flex-col items-center">
          <Button text={t("register")} onSubmit={onSubmit} />
          <Link href="/">
            <p className="text-xs dark:text-white">{t("backToLogin")}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
