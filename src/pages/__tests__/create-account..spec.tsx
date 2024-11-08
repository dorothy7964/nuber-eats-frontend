import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, waitFor } from "../../test-utils";
import { CreateAccount } from "../create-account";

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
});
