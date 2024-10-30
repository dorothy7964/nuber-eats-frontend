import { render } from "@testing-library/react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";
import { debug } from "console";

describe("<Restaurant />", () => {
  it("props와 함께 정상적으로 렌더링되어야 합니다.", () => {
    const restaurantProps = {
      id: "1",
      name: "name",
      categoryName: "categoryName",
      coverImg: "lala"
    };

    const { getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );

    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);

    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
  });
});
