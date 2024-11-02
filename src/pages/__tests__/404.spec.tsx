import { render, waitFor } from "../../test-utils";
import { NotFound } from "../404";

describe("<NotFound />", () => {
  it("정상적으로 렌더링되어야 하며, 타이틀이 설정되어야 합니다.", async () => {
    render(<NotFound />);

    await waitFor(() => {
      expect(document.title).toBe("404 | Nuber Eats");
    });
  });
});
