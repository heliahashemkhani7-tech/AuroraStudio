import { Outlet, useLocation } from "react-router-dom";

import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
import Footer from "./Footer";

export default function DefaultLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isAdminLogin = location.pathname === "/admin/login";

  return (
    <div className="flex flex-col gap-50">
      <Nav />

      <Outlet />

      <>
        <GrainientBg />
        {!isHome && !isAdminLogin && <Footer />}
      </>
    </div>
  );
}
