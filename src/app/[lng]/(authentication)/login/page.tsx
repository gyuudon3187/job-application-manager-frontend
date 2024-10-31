"use client";

import Input from "../../_components/input/Input";
import { useTranslation } from "@/app/_i18n/client";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Trans } from "react-i18next";
import Button from "../../_components/Button";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL, METHOD } from "@/utils/api";
import { useRouter } from "next/navigation";
import { withoutAuth } from "../../_components/withAuth";

enum ErrorKeys {
  InvalidCredentials = "invalidCredentialsError",
  RequiredField = "requiredFieldError",
}

async function login(email: string, password: string) {
  const response = await fetch(BASE_URL + "/login/", {
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

function Login({
  params: { lng },
}: Readonly<{
  params: {
    lng: string;
  };
}>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const formIsValid = useMemo(
    () => !!email && !!password && !emailError && !passwordError,
    [email, password, emailError, passwordError],
  );

  const { t } = useTranslation(lng, "auth");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: ({ token }) => {
      localStorage.setItem("token", token);
      router.push("/");
    },
    onError: (error: Error) => {
      const errorCode = error.message;
      switch (errorCode) {
        case "INVALID_CREDENTIALS":
          setEmailError(t(ErrorKeys.InvalidCredentials));
          setPasswordError(t(ErrorKeys.InvalidCredentials));
          break;
        default:
          console.error(`Error: ${errorCode}`);
      }
    },
  });

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

    if (formIsValid) {
      mutation.mutate();
    }
  };

  return (
    <>
      <h1 className="dark:text-white text-lg font-bold text-center py-5">
        {t("loginTitle")}
      </h1>
      <Input
        type="text"
        id="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        onChange={handleChange(setEmail)}
        onFocus={handleFocus(emailError, setEmailError)}
        error={emailError}
      />
      <Input
        type="password"
        id="password"
        label={t("password")}
        onChange={handleChange(setPassword)}
        onFocus={handleFocus(passwordError, setPasswordError)}
        error={passwordError}
      />
      <div className="flex flex-col items-center">
        <Button onClick={onSubmit} disabled={!formIsValid} lng={lng}>
          {t("login")}
        </Button>
        <Trans
          i18nKey="toSignup"
          t={t}
          components={{
            0: (
              <Link
                href={`/${lng}/register`}
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

export default withoutAuth(Login);
