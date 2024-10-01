import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserRole } from "../__generated__/types";
import { FullScreenLoader } from "../components/fullScreenLoader";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

/* 각 역할별 경로를 정의하는 타입 */
interface RouteType {
  path: string;
  component: JSX.Element;
}

/* 각 역할별 경로를 정의 */
const routes: Record<UserRole, RouteType[]> = {
  Client: [
    { path: "/", component: <Restaurants /> },
    { path: "/confirm", component: <ConfirmEmail /> },
    { path: "/edit-profile", component: <EditProfile /> }
  ],
  Owner: [{ path: "/", component: <div>owner 페이지</div> }],
  Delivery: [{ path: "/", component: <div>delivery 페이지</div> }]
};

/* 중복된 코드 제거를 위한 헬퍼 함수 */
const mapRoutes = (routes: RouteType[]) =>
  routes.map((route: any) => (
    <Route exact key={route.path} path={route.path}>
      {route.component}
    </Route>
  ));

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return <FullScreenLoader />;
  }

  const { me } = data;
  return (
    <Router>
      <Header />
      <Switch>
        {me.role === UserRole.Client && mapRoutes(routes.Client)}
        {me.role === UserRole.Owner && mapRoutes(routes.Owner)}
        {me.role === UserRole.Delivery && mapRoutes(routes.Delivery)}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
