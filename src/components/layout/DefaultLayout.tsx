import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
import Footer from "./Footer";

export default function DefaultLayout() {
  const location = useLocation();


  return (
    <div className="flex flex-col gap-50">
      <Nav />
      <Outlet />
      {location.pathname !== "/" && (
        <>
          <GrainientBg /> <Footer />
        </>
      )}
    </div>
  );
}
