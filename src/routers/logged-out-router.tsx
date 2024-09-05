import { isLoggedInVar } from "../apollo";

export const LoggedOutRouter = () => {
  return (
    <div>
      <h1>로그아웃 페이지</h1>
      <button onClick={() => isLoggedInVar(true)}>로그인</button>
    </div>
  );
};
