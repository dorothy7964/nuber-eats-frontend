import { render, screen, waitFor } from "@testing-library/react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>
  };
});

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>
  };
});

describe("<App />", () => {
  it("로그아웃된 라우터를 렌더링 합니다.", () => {
    render(<App />);
    screen.getByText("logged-out");
  });

  it("로그인된 라우터를 렌더링 합니다.", async () => {
    render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    screen.getByText("logged-in");
  });
});
