import { Helmet } from "react-helmet-async";

interface IHelmetProps {
  title: string;
  isPaddle?: boolean;
}

export const PageMeta: React.FC<IHelmetProps> = ({
  title,
  isPaddle = false
}) => (
  <Helmet>
    <title>{title} | Nuber Eats</title>
    {isPaddle && (
      <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
    )}
  </Helmet>
);
