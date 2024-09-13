// components/CenteredLayout.tsx
import { ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
  showModal?: boolean; // Add this if you want to conditionally render the modal
}

const AuthLayout = ({ children }: CenteredLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-128px)] w-full justify-center items-center">
      <div className="flex flex-col w-1/6 items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
