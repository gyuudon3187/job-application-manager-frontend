import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  disabled,
  onClick,
  ...rest
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
      dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 
      focus:outline-none focus:ring-4 focus:ring-gray-100 hover:bg-gray-100
      ${disabled ? "opacity-50 cursor-not-allowed focus:ring-0 hover:bg-white dark:opacity-50 dark:cursor-not-allowed dark:hover:bg-gray-800" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
