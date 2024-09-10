import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { headers } from "next/headers";
import { languages } from "@/app/_i18n/settings";

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
    <Menu as="div" className={className}>
      <div>
        <MenuButton className="inline-flex w-full h-10 justify-center gap-x-1.5 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <LanguageIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 dark:fill-white"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
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
          {/* <form action="#" method="POST"> */}
          {/*   <MenuItem> */}
          {/*     <button */}
          {/*       type="submit" */}
          {/*       className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900" */}
          {/*     > */}
          {/*       Sign out */}
          {/*     </button> */}
          {/*   </MenuItem> */}
          {/* </form> */}
        </div>
      </MenuItems>
    </Menu>
  );
}
