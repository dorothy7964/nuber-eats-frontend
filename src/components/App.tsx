import { LoggedInRouter } from "../routers/logged-in-router";
import { LoggedOutRouter } from "../routers/logged-out-router";

export const App = () => {
  const isLoggedIn = false;
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
