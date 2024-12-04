import { Link } from "react-router-dom";
import { Title } from "../components/title";
import { PageMeta } from "../components/pageMeta ";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <PageMeta title="404" />
    <Title hTag="h2" title="404 ERROR" />
    <h4 className="font-medium text-base mb-5">
      죄송합니다. 페이지를 찾을 수 없습니다.
      <br />
      존재하지 않는 주소를 입력하셨거나
      <br />
      요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
    </h4>
    <Link className="link" to="/">
      홈으로 &rarr;
    </Link>
  </div>
);
