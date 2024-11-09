import { render } from "@testing-library/react";
import { MenuIcon } from "../menuIcon";

describe("<MenuIcon />", () => {
  it("coverImg가 주어진 경우 해당 이미지를 렌더링해야 합니다.", () => {
    const { getByAltText } = render(<MenuIcon coverImg="chicken" />);

    const imgElement = getByAltText("메뉴 chicken 아이콘") as HTMLImageElement;
    expect(imgElement.src).toContain("/chicken.png");
  });

  it("coverImg가 null이거나 undefined인 경우 기본 이미지를 렌더링해야 합니다.", () => {
    const { getByAltText } = render(<MenuIcon coverImg={null} />);

    const imgElement = getByAltText("메뉴 기본 아이콘") as HTMLImageElement;
    expect(imgElement.src).toContain("/basic-menu.png");
  });

  it("기본 iconSize가 적용 되어야 합니다.", () => {
    const { container } = render(<MenuIcon coverImg="pizza" />);

    expect(container.firstChild).toHaveClass("w-10");
  });

  it("iconSize가 주어진 경우 해당 클래스가 적용되어야 합니다.", () => {
    const { container } = render(<MenuIcon coverImg="pizza" iconSize="w-20" />);

    expect(container.firstChild).toHaveClass("w-20");
  });
});
