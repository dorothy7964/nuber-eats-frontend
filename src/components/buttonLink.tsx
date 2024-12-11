import { Link } from "react-router-dom";

interface IButtonLinkProps {
  className?: string;
  text: string;
  bgColor: string;
  textColor?: string;
  isArrowVisible: boolean;
  toLink: string;
}

export const ButtonLink: React.FC<IButtonLinkProps> = ({
  className,
  text,
  bgColor,
  textColor = "text-white", // 기본 텍스트 색상
  isArrowVisible,
  toLink
}) => {
  // hover 배경색 계산
  const hoverBgColor = bgColor.replace(
    /(\d{3})$/, // 숫자 3자리 패턴 (예: "600")
    (match) => String(Math.min(900, Number(match) + 100)) // Math.min(a, b)는 둘 중 작은 값을 반환, 최대값은 900
  );

  return (
    <Link
      to={toLink}
      className={`btn-link ${bgColor} hover:${hoverBgColor} ${textColor} ${
        className || ""
      }`}
      role="link"
    >
      {text} {isArrowVisible && <span>&rarr;</span>}
    </Link>
  );
};
