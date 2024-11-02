import { ApolloProvider } from "@apollo/client";
import { act, render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Login, LOGIN_MUTATION } from "../login";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;

  beforeEach(async () => {
    mockClient = createMockClient();

    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockClient}>
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

  it("비밀번호 입력하지 않았다면 오류를 표시해야 합니다.", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const submitBtn = getByRole("button");

    await act(async () => {
      userEvent.type(email, "test@gmail.com");
      userEvent.click(submitBtn);
    });

    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent("비밀번호를 입력해 주세요.");
    });
  });

  it("비밀번호의 최소 글자 수를 충족하지 못하면 오류 메시지가 표시되어야 합니다.", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");

    await act(async () => {
      userEvent.type(email, "test@gmail.com");
      userEvent.type(password, "비밀");
      userEvent.click(submitBtn);
    });

    await waitFor(() => {
      const errorMessage = getByRole("alert");
      expect(errorMessage).toHaveTextContent(
        "비밀번호는 5자 이상이어야 합니다."
      );
    });
  });

  it("Form을 제출하고 Muatation을 호출해야 합니다.", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123123"
    };

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: null
          // error: "mutation-error"
        }
      }
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await act(async () => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password
      }
    });
  });
});
