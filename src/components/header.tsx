import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import nuberLogo from "../images/logo_text.svg";
import { useMe } from "../hooks/useMe";

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <>
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-44" alt="Nuber Eats" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-3xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
