import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function DefaultLayout() {
  return (
    <div>
      <Nav />

      <Outlet />
    </div>
  );
}
