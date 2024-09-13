import { useTranslation } from "@/app/_i18n/client";
import React, {
  ButtonHTMLAttributes,
  ReactNode,
  useState,
  MouseEventHandler,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  lng?: string;
  onClick: MouseEventHandler<HTMLButtonElement>; // Type onClick as MouseEventHandler<HTMLButtonElement>
}

export default function Button({
  children,
  disabled,
  lng,
  onClick,
  ...rest
}: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(lng, "data");

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setLoading(true); // Start loading when the fetch call begins

    try {
      await onClick(e); // Execute the provided onClick function (your fetch call)
    } finally {
      setLoading(false); // Stop loading when the fetch call resolves
    }
  };

  return (
    <button
      className={`relative duration-100 ease-in-out text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
        dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 
        focus:outline-none focus:ring-gray-100 hover:bg-gray-100 focus:ring-0
        ${disabled || loading ? "opacity-50 cursor-not-allowed hover:bg-white dark:opacity-50 dark:cursor-not-allowed dark:hover:bg-gray-800" : ""}
        ${loading ? "min-w-[150px] max-w-[200px]" : "min-w-[120px] max-w-[200px]"} transition-width`}
      onClick={handleClick}
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
