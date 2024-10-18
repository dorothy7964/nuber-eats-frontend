import { Link, useParams } from "react-router-dom";
import { MenuIcon } from "./menuIcon";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT } from "../fragments";
import {
  AllCategoriesQuery,
  AllCategoriesQueryVariables
} from "../__generated__/types";

const ALLCATEGORY_QUERY = gql`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug?: string;
}

export const CategoryList: React.FC = () => {
  const params = useParams<ICategoryParams>();

  const { data: allCategoryData } = useQuery<
    AllCategoriesQuery,
    AllCategoriesQueryVariables
  >(ALLCATEGORY_QUERY);

  return (
    <div className="flex justify-around max-w-lg mx-auto">
      {allCategoryData?.allCategories.categories?.map((category) => (
        <Link key={category.id} to={`/category/${category.slug}`}>
          <div
            key={category.id}
            className="flex flex-col group items-center cursor-pointer"
          >
            <div
              className={`w-16 h-16 group-hover:bg-gray-100 rounded-full flex justify-center items-center
                ${category.slug === params.slug ? "bg-gray-200" : ""}`}
            >
              <MenuIcon coverImg={category.coverImg} />
            </div>
            <span
              className={`mt-1 text-sm text-center ${
                category.slug === params.slug ? "font-bold" : "font-medium"
              }`}
            >
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
