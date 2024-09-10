import { ChangeEvent, FocusEventHandler, useEffect, useMemo } from "react";

export default function Input({
  label,
  type,
  onChange,
  placeholder = "",
  onFocus = () => {},
  className = "",
  error = "",
}: Readonly<{
  label: string;
  type: "text" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  error?: string;
}>) {
  const isValid = useMemo(() => !error, [error]);

  useEffect(() => console.log(label + ": " + isValid), [isValid]);

  interface Style {
    common: string;
    valid: string;
    invalid: string;
  }

  function applyStyle(style: Style): string {
    return `${style.common} ${isValid ? style.valid : style.invalid}`;
  }

  const labelStyle = {
    common: "block mb-2 text-sm font-medium",
    valid: "text-gray-900 dark:text-white",
    invalid: "text-red-700 dark:text-red-500",
  };

  const inputStyle = {
    common:
      "text-sm border rounded-lg block w-full p-2.5 dark:bg-gray-700 outline-blue-500",
    valid:
      "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-blue-500",
    invalid:
      "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:outline-red-500 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500 dark:focus:outline-red-500",
  };

  return (
    <div className={className}>
      <label htmlFor="error" className={applyStyle(labelStyle)}>
        {label}
      </label>
      <input
        onChange={onChange}
        onFocus={onFocus}
        type={type}
        className={applyStyle(inputStyle)}
        placeholder={placeholder}
      />
      <p
        className={`mt-2 pb-3 text-xs text-red-600 dark:text-red-500${isValid ? " invisible" : ""}`}
      >
        {error || "dummy value"}
      </p>
    </div>
  );
}
