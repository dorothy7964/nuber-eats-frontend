import { fireEvent, render } from "@testing-library/react";
import { PageButton } from "../pageButton";

describe("<PageButton />", () => {
  const onNextPageClick = jest.fn();
  const onPrevPageClick = jest.fn();

  it("totalPages가 0 또는 undefined일 경우 아무것도 렌더링하지 않아야 합니다.", () => {
    const { container } = render(
      <PageButton
        page={1}
        totalPages={0}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );
    expect(container.firstChild).toBeNull();

    const { container: containerUndefined } = render(
      <PageButton
        page={1}
        totalPages={undefined}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );
    expect(containerUndefined.firstChild).toBeNull();
  });

  it("페이지 정보가 올바르게 렌더링되어야 합니다.", () => {
    const { getByText } = render(
      <PageButton
        page={2}
        totalPages={5}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );
    getByText("페이지 2 의 5");
  });

  it("페이지가 1일 때 이전 페이지 버튼이 숨겨져야 합니다.", async () => {
    const { queryByRole } = render(
      <PageButton
        page={1}
        totalPages={5}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );

    // 'prev-button' aria-label로 버튼을 찾기
    // queryByRole은 해당 역할을 가진 요소가 있을 수도 없을 수도 있다고 가정하며, 요소가 없으면 null을 반환
    const prevButton = queryByRole("button", { name: "prev-button" });

    // 버튼이 화면에 없으면 null을 반환하므로 이를 확인
    expect(prevButton).toBeNull();
  });

  it("마지막 페이지일 때 다음 페이지 버튼이 숨겨져야 합니다.", () => {
    const { queryByRole } = render(
      <PageButton
        page={5}
        totalPages={5}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );

    // 'next-button' aria-label로 버튼을 찾기
    // queryByRole은 해당 역할을 가진 요소가 있을 수도 없을 수도 있다고 가정하며, 요소가 없으면 null을 반환
    const nextButton = queryByRole("button", { name: "next-button" });

    // 버튼이 화면에 없으면 null을 반환하므로 이를 확인
    expect(nextButton).toBeNull();
  });

  it("이전 페이지 버튼을 클릭하면 onPrevPageClick이 호출이 되어야 합니다.", () => {
    const { getByRole } = render(
      <PageButton
        page={2}
        totalPages={5}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );

    const prevButton = getByRole("button", {
      name: "prev-button"
    });
    fireEvent.click(prevButton);
    expect(onPrevPageClick).toHaveBeenCalled();
  });

  it("다음 페이지 버튼을 클릭하면 onNextPageClick이 호출이 되어야 합니다.", () => {
    const { getByRole } = render(
      <PageButton
        page={2}
        totalPages={5}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    );

    const nextButton = getByRole("button", {
      name: "next-button"
    });
    fireEvent.click(nextButton);
    expect(onNextPageClick).toHaveBeenCalled();
  });
});
