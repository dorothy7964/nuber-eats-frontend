import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={() => isLoggedInVar(false)}>로그아웃</button>
    </div>
  );
};
