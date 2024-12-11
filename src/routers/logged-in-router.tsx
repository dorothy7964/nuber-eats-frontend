import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserRole } from "../__generated__/types";
import { FullScreenLoader } from "../components/fullScreenLoader";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";

/* 각 역할별 경로를 정의하는 타입 */
interface RouteType {
  path: string;
  component: JSX.Element;
}

/* 각 역할별 경로를 정의 */
const routes: Record<UserRole, RouteType[]> = {
  Client: [
    { path: "/", component: <Restaurants /> },
    { path: "/search", component: <Search /> },
    { path: "/category/:slug", component: <Category /> },
    { path: "/restaurant/:id", component: <Restaurant /> }
  ],
  Owner: [
    {
      path: "/",
      component: <MyRestaurants />
    },
    { path: "/add-restaurant", component: <AddRestaurant /> },
    { path: "/restaurant/:id", component: <MyRestaurant /> }
  ],
  Delivery: [{ path: "/", component: <div>delivery 페이지</div> }]
};

/* 공통 컴포넌트 */
const commonRoutes: RouteType[] = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> }
];

/* RouteType 배열을 기반으로 <Route> 컴포넌트를 동적으로 생성 */
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
        {mapRoutes(commonRoutes)}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
