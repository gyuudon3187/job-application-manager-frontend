import { TFunction } from "i18next";
import { ReactNode, useEffect, useState } from "react";

interface ModalProps {
  show: boolean;
  countdownStart?: number;
  onCountdownEnd?: () => void;
  t: TFunction;
  children: ReactNode;
}

export default function Modal({
  show,
  countdownStart = 0,
  onCountdownEnd,
  t,
  children,
}: ModalProps) {
  const [countdown, setCountdown] = useState(countdownStart);

  useEffect(() => {
    if (!show || countdownStart === 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (onCountdownEnd) {
            onCountdownEnd();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, countdownStart, onCountdownEnd]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center animate-slideDown">
        {children}
        {countdownStart > 0 && (
          <p className="mt-4">{t("redirectToLogin", { seconds: countdown })}</p>
        )}
      </div>
    </div>
  );
}
