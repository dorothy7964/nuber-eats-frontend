import { Link } from "react-router-dom";
import { MenuIcon } from "./menuIcon";

interface ICategoryListProps {
  id: number;
  name: string;
  slug: string;
  coverImg: string | null | undefined;
}

export const CategoryList: React.FC<ICategoryListProps> = ({
  id,
  name,
  slug,
  coverImg
}) => (
  <Link key={id} to={`/category/${slug}`}>
    <div key={id} className="flex flex-col group items-center cursor-pointer">
      <div className="w-16 h-16 group-hover:bg-gray-100 rounded-full flex justify-center items-center">
        <MenuIcon coverImg={coverImg} />
      </div>
      <span className="mt-1 text-sm text-center font-medium">{name}</span>
    </div>
  </Link>
);
