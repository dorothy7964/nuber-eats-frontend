import { ApolloProvider } from "@apollo/client";
import { act, RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, waitFor } from "../../test-utils";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/types";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");

  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush
      };
    }
  };
});

describe("<CreateAccount />", () => {
  let mockClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    mockClient = createMockClient();

    renderResult = render(
      <ApolloProvider client={mockClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  });

  it("정상적으로 렌더링되어야 하며, 타이틀이 설정되어야 합니다.", async () => {
    await waitFor(() => {
      expect(document.title).toBe("계정 만들기 | Nuber Eats");
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
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123123",
      role: UserRole.Client
    };

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error"
        }
      }
    });
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );

    jest.spyOn(window, "alert").mockImplementation(() => null);

    await act(async () => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      });

      expect(window.alert).toHaveBeenCalledWith(
        "계정 생성! 지금 로그인하세요!"
      );

      const mutationError = getByRole("alert");
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mutationError).toHaveTextContent("mutation-error");
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
