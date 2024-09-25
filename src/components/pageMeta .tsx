import { Helmet } from "react-helmet-async";

interface IHelmetProps {
  title: string;
}

export const PageMeta: React.FC<IHelmetProps> = ({ title }) => (
  <Helmet>
    <title> {title} | Nuber Eats</title>
  </Helmet>
);
