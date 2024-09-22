import React from "react";
import { PageMeta } from "../components/pageMeta ";
import nuberLogo from "../images/logo_img.svg";

interface LogoLayoutProps {
  helmetTitle: string;
  title: string;
  children: React.ReactNode;
}

export const LogoLayout: React.FC<LogoLayoutProps> = ({
  helmetTitle,
  title,
  children
}) => (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
    <PageMeta title={helmetTitle} />
    <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
      <img src={nuberLogo} className="w-52 mb-10" alt="logo" />
      <h4 className="w-full font-medium text-left text-3xl mb-5">{title}</h4>
      {children}
    </div>
  </div>
);
