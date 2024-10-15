import { useHistory, useLocation } from "react-router-dom";
import { PageMeta } from "../../components/pageMeta ";
import { useEffect } from "react";

export const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    // URL에서 쿼리 파라미터를 추출하고 디코딩
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = decodeURIComponent(searchParams.get("term") || "");

    if (!searchTerm) {
      return history.replace("/");
    }
  }, [history, location]);

  return (
    <div>
      <PageMeta title="검색" />
      <h1>검색 페이지</h1>
    </div>
  );
};
