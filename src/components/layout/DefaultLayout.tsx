import { Outlet, useLocation } from "react-router-dom";

import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
import Footer from "./Footer";

export default function DefaultLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isAdminLogin = location.pathname === "/account/auth";

  return (
    <div className="flex flex-col gap-50">
      {!isAdminLogin && <Nav />}

      <Outlet />

      <>
        <GrainientBg />
        {!isHome && !isAdminLogin && <Footer />}
      </>
    </div>
  );
}
