import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";

import HomeSkeleton from "@/components/skeleton/HomeSkeleton";
import AboutSkeleton from "@/components/skeleton/AboutSkeleton";
import ContactSkeleton from "@/components/skeleton/ContactSkeleton";
import PortfolioSkeleton from "@/components/skeleton/PortfolioSkeleton";
import ProjectDetailsSkeleton from "@/components/skeleton/ProjectDetailsSkeleton";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProjects from "./admin/AdminProjects";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const Portfolio = lazy(() => import("./Portfolio"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));

export default function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<AboutSkeleton />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<ContactSkeleton />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Suspense fallback={<PortfolioSkeleton />}>
              <Portfolio />
            </Suspense>
          }
        />
        <Route
          path="/portfolio/:slug"
          element={
            <Suspense fallback={<ProjectDetailsSkeleton />}>
              <ProjectDetails />
            </Suspense>
          }
        />
        <Route path="/account/auth" element={<AdminLogin />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/dashboard/projects" element={<AdminProjects />} />
        </Route>
      </Route>
    </Routes>
  );
}
