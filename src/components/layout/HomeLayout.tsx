import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function HomeLayout() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}
