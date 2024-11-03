import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ReactNode } from "react";

export default function DropdownButton({
  className,
  children,
  Icon,
}: Readonly<{
  className: string;
  children: ReactNode;
  Icon: React.ElementType;
}>) {
  return (
    <Menu as="div" className={className}>
      <div>
        <MenuButton className="w-full h-10 gap-x-1.5 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <Icon aria-hidden="true" className="-mr-1 h-5 w-5 dark:fill-white" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">{children}</div>
      </MenuItems>
    </Menu>
  );
}
