interface TitleProps {
  hTag?: "h2" | "h4";
  title: string;
}

export const Title: React.FC<TitleProps> = ({ hTag = "h4", title }) => {
  const Tag = hTag; // hTag에 따라 동적으로 태그 선택

  return <Tag className="font-semibold text-2xl mb-3">{title}</Tag>;
};
