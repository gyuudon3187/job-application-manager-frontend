import { useLng } from "@/utils/providers/LngContext";
import { MenuItem } from "@headlessui/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function DropdownItem({
  children,
}: Readonly<{ children: ReactNode }>) {
  const lng = useLng();
  return (
    <MenuItem>
      <Link
        href={`/${lng}/settings`}
        className="block px-4 py-2 text-sm text-gray-700 dark:text-white dark:data-[focus]:bg-gray-600 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
      >
        {children}
      </Link>
    </MenuItem>
  );
}
