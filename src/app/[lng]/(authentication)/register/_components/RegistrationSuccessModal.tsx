"use client";

import Modal from "@/app/[lng]/_components/Modal";
import { TFunction } from "i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trans } from "react-i18next";

export default function RegistrationSuccessModal({
  show,
  t,
}: Readonly<{ show: boolean; t: TFunction }>) {
  const router = useRouter();

  const handleCountdownEnd = () => {
    router.push("/");
  };

  return (
    <Modal
      show={show}
      countdownStart={3}
      onCountdownEnd={handleCountdownEnd}
      t={t}
    >
      <h2 className="text-xl font-semibold mb-4">
        {t("registrationComplete")}
      </h2>
      <p className="mb-4">
        <Trans
          i18nKey="informAboutLogin"
          t={t}
          components={{
            0: <Link href="/" className="text-blue-600 underline" />,
          }}
        />
      </p>
    </Modal>
  );
}
