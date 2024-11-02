import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Login } from "../login";
import { debug } from "console";

describe("<Login />", () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    const mockedClient = createMockClient();

    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <Login />
          </ApolloProvider>
        </Router>
      </HelmetProvider>
    );
  });

  it("정상적으로 렌더링되어야 하며, 타이틀이 설정되어야 합니다.", async () => {
    await waitFor(() => {
      expect(document.title).toBe("로그인 | Nuber Eats");
    });
  });

  it("이메일 유효성 검사의 오류를 표시해야 합니다.", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");

    // 이메일 형식이 잘못된 경우
    userEvent.type(email, "test@gmail");

    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent("잘못된 이메일 형식입니다.");
    });

    // 이메일을 입력하지 않았을 경우, input에서 모든 value 지우기
    userEvent.clear(email);

    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent("이메일을 입력해 주세요.");
    });
  });
});
