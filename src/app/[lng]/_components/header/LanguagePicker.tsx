import { MenuItem } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { languages } from "@/app/_i18n/settings";
import DropdownButton from "../dropdown/DropdownButton";
import { headers } from "next/headers";

export default function LanguagePicker({
  className,
}: Readonly<{
  className: string;
}>) {
  function getPathWithoutLng(path: string) {
    return path!.replace(/^\/[a-z]{2,3}\//, "/");
  }

  const headerList = headers();
  const pathname = headerList.get("x-url");
  let pathWithoutLng = "";

  if (pathname) {
    pathWithoutLng = getPathWithoutLng(pathname);
  }
  return (
    <div data-testid="language-picker">
      <DropdownButton className={className} Icon={LanguageIcon}>
        {languages.map((lng) => (
          <MenuItem key={`${lng.code}`}>
            <Link
              href={`/${lng.code}${pathWithoutLng}`}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-white dark:data-[focus]:bg-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              {lng.name}
            </Link>
          </MenuItem>
        ))}
      </DropdownButton>
    </div>
  );
}
