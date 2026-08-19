import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import GrainientBg from "../ui/GrainientBg";
// import Footer from "./Footer";

export default function DefaultLayout() {
  return (
    <div>
      <GrainientBg />
      <Nav />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
