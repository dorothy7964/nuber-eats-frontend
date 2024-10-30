import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
  it("이메일 인증이 되지 않은 경우에는 배너가 표시되어야 합니다.", async () => {
    const { getByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: false
                }
              }
            }
          }
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      getByText("이메일을 확인하시기 바랍니다.");
    });
  });

  it("이메일 인증이 완료된 경우에는 배너가 표시되지 않아야 합니다.", async () => {
    const { queryByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: true
                }
              }
            }
          }
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );

    // 이메일 인증 상태에 따라 배너가 표시되지 않아야 함을 기다린다.
    await waitFor(() => {
      expect(queryByText("이메일을 확인하시기 바랍니다.")).toBeNull();
    });
  });
});