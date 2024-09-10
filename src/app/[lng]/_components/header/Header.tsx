import ThemeSwitcher from "./ThemeSwitcher";
import LanguagePicker from "./LanguagePicker";

export default function Header({ title }: Readonly<{ title: string }>) {
  return (
    <div className="fixed top-0 right-0 left-0 py-2 px-4 w-full flex justify-between items-center">
      <div className="pl-24" />
      <div className="text-lg font-bold dark:text-white">{title}</div>
      <div className="flex space-x-1">
        <ThemeSwitcher />
        <LanguagePicker className="relative inline-block text-left" />
      </div>
    </div>
  );
}
