import { render } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
  it("props와 함께 정상적으로 렌더링되어야 합니다.", () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText="테스트" />
    );
    getByText("테스트");

    /* 같은 컴포넌트를 다른 props로 리랜더링 */
    // render(<Button canClick={false} loading={true} actionText="테스트" />);
    // getByText("로딩 중...");
    // debug();
  });

  it("로딩을 표시해야 합니다.", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText={"test"} />
    );
    getByText("로딩 중...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
