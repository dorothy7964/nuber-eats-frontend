import chicken from "../images/chicken.png";
import pizza from "../images/pizza.png";
import jjajangmyeon from "../images/jjajangmyeon.png";
import sushi from "../images/sushi.png";
import hamburger from "../images/hamburger.png";
import tteokbokki from "../images/tteokbokki.png";
import dessert from "../images/dessert.png";
import basic from "../images/basic-menu.png";

// 카테고리 이름에 따른 아이콘 매핑
const menuIconMap: any = {
  chicken,
  pizza,
  jjajangmyeon,
  sushi,
  hamburger,
  tteokbokki,
  dessert,
  basic
};

interface IMenuIconProps {
  coverImg: string | null | undefined;
  iconSize?: string;
}

export const MenuIcon: React.FC<IMenuIconProps> = ({
  coverImg,
  iconSize = "w-10"
}) => {
  const imgSrc =
    menuIconMap[coverImg as keyof typeof menuIconMap] || menuIconMap["basic"];

  return (
    <img
      src={imgSrc}
      className={iconSize}
      alt={`메뉴 ${coverImg || "기본"} 아이콘`}
    />
  );
};
