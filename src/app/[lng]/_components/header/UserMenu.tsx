"use client";
import { UserIcon } from "@heroicons/react/20/solid";
import DropdownButton from "../dropdown/DropdownButton";
import DropdownItem from "../dropdown/DropdownItem";
import { useLng } from "@/utils/providers/LngContext";
import { useTranslation } from "@/app/_i18n/client";

export default function UserMenu({
  className,
}: Readonly<{
  className?: string;
}>) {
  const lng = useLng();
  const { t } = useTranslation(lng, "header");

  return (
    <div data-testid="user-menu">
      <DropdownButton Icon={UserIcon} className={className ? className : ""}>
        <DropdownItem>{t("settings")}</DropdownItem>
        <DropdownItem>{t("signOut")}</DropdownItem>
      </DropdownButton>
    </div>
  );
}
