// 영어 → 한글 매핑
const menuNameMap: Record<string, string> = {
  chicken: "치킨",
  pizza: "피자",
  jjajangmyeon: "짜장면",
  sushi: "스시",
  hamburger: "햄버거",
  tteokbokki: "떡볶이",
  dessert: "디저트",
  salad: "샐러드",
  basic: "기본"
};

interface IMenuTitleProps {
  slug: string | null | undefined;
  highlight: boolean;
}

export const MenuTitle: React.FC<IMenuTitleProps> = ({ slug, highlight }) => {
  const menuName =
    menuNameMap[slug as keyof typeof menuNameMap] || menuNameMap["basic"];

  return (
    <span
      className={`mt-1 text-sm text-center ${
        highlight ? "font-bold" : "font-medium"
      }`}
    >
      {menuName}
    </span>
  );
};
