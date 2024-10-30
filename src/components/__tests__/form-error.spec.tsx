import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("props와 함께 정상적으로 렌더링되어야 합니다.", () => {
    const { getByText } = render(<FormError errorMessage="에러 발생" />);
    getByText("에러 발생");
  });
});
