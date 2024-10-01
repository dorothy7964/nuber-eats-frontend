import React from "react";

interface AuthFormLayoutProps {
  children: React.ReactNode;
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({ children }) => (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
    <div className="w-full max-w-screen-sm flex flex-col items-center">
      {children}
    </div>
  </div>
);
