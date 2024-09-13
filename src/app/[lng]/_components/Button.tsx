import { useTranslation } from "@/app/_i18n/client";
import React, {
  ButtonHTMLAttributes,
  ReactNode,
  MouseEventHandler,
} from "react";
import Loading from "./Loading";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  lng?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  disabled,
  loading,
  lng,
  onClick,
  ...rest
}: ButtonProps) {
  const { t } = useTranslation(lng, "data");

  return (
    <button
      className={`relative duration-100 ease-in-out text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 
        focus:outline-none focus:ring-gray-100 hover:bg-gray-100 focus:ring-0
        ${disabled || loading ? "opacity-50 cursor-not-allowed hover:bg-white dark:opacity-50 dark:cursor-not-allowed dark:hover:bg-gray-800" : ""}
        ${loading ? "min-w-[150px] max-w-[200px]" : "min-w-[120px] max-w-[200px]"} transition-width`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-flex items-center justify-center w-full">
            <Loading size={4} />
            {t("loading")}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
