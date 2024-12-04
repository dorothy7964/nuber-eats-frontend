import { Link } from "react-router-dom";

interface INoRestaurantsProps {
  title: string;
  linkTitle: string;
  linkAddress: string;
}

export const NoRestaurants: React.FC<INoRestaurantsProps> = ({
  title,
  linkTitle,
  linkAddress
}) => {
  return (
    <>
      <h4 className="text-xl mb-5">{title}</h4>
      <Link className="link" to={linkAddress}>
        {linkTitle} &rarr;
      </Link>
    </>
  );
};
