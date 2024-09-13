"use client";

import { useTranslation } from "@/app/_i18n/client";
import {
  emailConstraint,
  passwordConstraint,
} from "../../_components/input/constraints";
import Input from "../../_components/input/Input";
import Button from "../../_components/Button";
import {
  useState,
  useMemo,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL, METHOD } from "@/utils/api";
import Link from "next/link";
import { Trans } from "react-i18next";
import RegistrationSuccessModal from "./_components/RegistrationSuccessModal";
import { withoutAuth } from "../../_components/withAuth";

enum ErrorKeys {
  EmailAlreadyRegistered = "emailAlreadyExistsError",
  EmailFormatInvalid = "emailFormatError",
  RequiredField = "requiredFieldError",
  PasswordError = "passwordError",
  ConfirmPasswordError = "confirmPasswordError",
}

async function signup(email: string, password: string) {
  const response = await fetch(BASE_URL + "/signup/", {
    method: METHOD.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

function Registration({ params: { lng } }: { params: { lng: string } }) {
  const [showModal, setShowModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const formIsValid = useMemo(
    () =>
      !!email &&
      !!password &&
      !!confirmPassword &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError,
    [
      email,
      password,
      confirmPassword,
      emailError,
      passwordError,
      confirmPasswordError,
    ],
  );

  const { t } = useTranslation(lng, "auth");

  const mutation = useMutation({
    mutationFn: () => signup(email, password),
    onSuccess: () => {
      setShowModal(true);
    },
    onError: (error: Error) => {
      const errorCode = error.message;
      switch (errorCode) {
        case "USER_ALREADY_REGISTERED":
          setEmailError(t(ErrorKeys.EmailAlreadyRegistered));
          break;
        default:
          console.error(`Error: ${errorCode}`);
      }
    },
  });

  function validateField(
    value: string,
    constraint: string,
    errorKey: ErrorKeys,
    setError: Dispatch<SetStateAction<string>>,
  ) {
    if (value) {
      try {
        const regex = new RegExp(constraint);
        setError(regex.test(value) ? "" : t(errorKey));
      } catch (e) {
        console.error(`Invalid regex pattern: ${constraint}`);
      }
    }
  }

  function validateConfirmPassword() {
    setConfirmPasswordError(
      confirmPassword === password ? "" : t(ErrorKeys.ConfirmPasswordError),
    );
  }

  useEffect(() => {
    validateField(
      email,
      emailConstraint,
      ErrorKeys.EmailFormatInvalid,
      setEmailError,
    );
    validateField(
      password,
      passwordConstraint,
      ErrorKeys.PasswordError,
      setPasswordError,
    );
    validateConfirmPassword();
  }, [email, password, confirmPassword, t]);

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleFocus =
    (error: string, setter: Dispatch<SetStateAction<string>>) => () => {
      if (error) setter("");
    };

  const onSubmit = () => {
    if (!email) setEmailError(t(ErrorKeys.RequiredField));
    if (!password) setPasswordError(t(ErrorKeys.RequiredField));
    if (!confirmPassword) setConfirmPasswordError(t(ErrorKeys.RequiredField));

    if (formIsValid) {
      mutation.mutate();
    }
  };

  return (
    <>
      <RegistrationSuccessModal show={showModal} t={t} />
      <h1 className="dark:text-white text-lg font-bold text-center py-5">
        {t("registerTitle")}
      </h1>
      <Input
        type="text"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        onChange={handleChange(setEmail)}
        onFocus={handleFocus(emailError, setEmailError)}
        error={emailError}
      />
      <Input
        type="password"
        label={t("password")}
        onChange={handleChange(setPassword)}
        onFocus={handleFocus(passwordError, setPasswordError)}
        error={passwordError}
      />
      <Input
        type="password"
        label={t("confirmPassword")}
        onChange={handleChange(setConfirmPassword)}
        onFocus={handleFocus(confirmPasswordError, setConfirmPasswordError)}
        error={confirmPasswordError}
      />
      <div className="flex flex-col items-center">
        <Button
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!formIsValid}
          lng={lng}
        >
          {t("register")}
        </Button>
        <Trans
          i18nKey="backToLogin"
          t={t}
          components={{
            0: (
              <Link
                href={`/${lng}/login`}
                className="text-pink-300 hover:text-pink-500"
              />
            ),
            1: <p className="text-xs dark:text-white" />,
          }}
        />
      </div>
    </>
  );
}

export default withoutAuth(Registration);
