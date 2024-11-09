import { render } from "@testing-library/react";
import { FullScreenLoader } from "../fullScreenLoader";

describe("<FullScreenLoader />", () => {
  it("정상적으로 렌더링을 해야 합니다.", () => {
    const { getByText } = render(<FullScreenLoader />);

    getByText("로딩 중...");
  });
});
