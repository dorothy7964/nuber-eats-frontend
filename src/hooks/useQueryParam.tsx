import { useLocation } from "react-router-dom";

export const useQueryParam = (paramName: string) => {
  return new URLSearchParams(useLocation().search).get(paramName);
};
