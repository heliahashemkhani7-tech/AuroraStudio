import { Outlet, useLocation } from "react-router-dom";

import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
import Footer from "./Footer";
import SplashCursor from "../animiations/SplashCursor";

export default function DefaultLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isAdminLogin = location.pathname === "/account/auth";

  return (
    <div className="flex flex-col gap-50">
      {!isAdminLogin && (
        <>
          <SplashCursor
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            COLOR_UPDATE_SPEED={10}
            SHADING
            RAINBOW_MODE={false}
            COLOR="var(--span)"
          />
          <Nav />
        </>
      )}

      <Outlet />

      <>
        <GrainientBg />
        {!isHome && !isAdminLogin && <Footer />}
      </>
    </div>
  );
}
