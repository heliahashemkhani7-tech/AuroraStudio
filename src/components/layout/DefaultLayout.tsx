import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
import Footer from "./Footer";

export default function DefaultLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-50">
      <GrainientBg />
      <Nav />
      <Outlet />
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}
