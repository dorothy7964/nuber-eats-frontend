import { MockedProvider } from "@apollo/client/testing";
import { RenderResult } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "../../test-utils";
import { ALLCATEGORY_QUERY, CategoryList } from "../categoryList";

// Mock useParams
jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");

  return {
    ...realModule,
    useParams: () => {
      return {
        slug: "치킨" // Mock params.slug 값
      };
    }
  };
});

// Mock Data
const mockCategorie = [
  {
    id: 1,
    name: "치킨",
    coverImg: "chicken",
    slug: "치킨",
    restaurantCount: 2
  },
  {
    id: 3,
    name: "중식",
    coverImg: "jjajangmyeon",
    slug: "중식",
    restaurantCount: 2
  },
  {
    id: 5,
    name: "일식",
    coverImg: "sushi",
    slug: "일식",
    restaurantCount: 2
  },
  {
    id: 6,
    name: "분식",
    coverImg: "tteokbokki",
    slug: "분식",
    restaurantCount: 2
  },
  {
    id: 7,
    name: "디저트",
    coverImg: "dessert",
    slug: "디저트",
    restaurantCount: 2
  },
  {
    id: 4,
    name: "패스트푸드",
    coverImg: "hamburger",
    slug: "패스트푸드",
    restaurantCount: 2
  },
  {
    id: 2,
    name: "피자",
    coverImg: "pizza",
    slug: "피자",
    restaurantCount: 2
  }
];

// Apollo Client mock 설정
const mocks = [
  {
    request: {
      query: ALLCATEGORY_QUERY
    },
    result: {
      data: {
        allCategories: {
          categories: mockCategorie
        }
      }
    }
  }
];

describe("<CategoryList />", () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    //! MockedProvider에서 Apollo Client의 쿼리 결과가 처리되는 방식에서 문제가 발생했을 때 나타납니다. 구체적으로, 쿼리의 응답이 예상한 대로 처리되지 않거나 데이터가 잘못 전달되었을 가능성이 있다.
    renderResult = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <CategoryList />
        </Router>
      </MockedProvider>
    );
  });

  it("정상적으로 렌더링되어야 합니다.", async () => {
    const { getByText } = renderResult;

    await waitFor(() => {
      mockCategorie.map((category) => {
        getByText(category.name);
      });
    });
  });

  it("선택한 카테고리 아이콘은 Active 상태를 나타내도록 스타일링 되어야 합니다", async () => {
    const { findByText } = renderResult;
    const selectedCategory = await findByText("치킨"); // "치킨" 텍스트를 포함한 요소 찾기
    expect(selectedCategory).toHaveClass("font-bold"); // 선택된 카테고리의 부모 요소(span)에 'font-bold' 클래스 확인
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
