
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import HomeSkeleton from "@/components/skeleton/HomeSkeleton";
import AboutSkeleton from "@/components/skeleton/AboutSkeleton";
import ContactSkeleton from "@/components/skeleton/ContactSkeleton";
import PortfolioSkeleton from "@/components/skeleton/PortfolioSkeleton";
import ProjectDetailsSkeleton from "@/components/skeleton/ProjectDetailsSkeleton";
import BlogSkeleton from "@/components/skeleton/BlogSkeleton";

import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProjects from "./admin/AdminProjects";
import AdminProjectsForm from "./admin/AdminProjectsForm";
import AdminProjectCategories from "./admin/AdminProjectCategories";
import AdminBlogCategories from "./admin/AdminBlogCategories";
import AdminBlog from "./admin/AdminBlog";
import AdminBlogForm from "./admin/AdminBlogForm";
import AdminInbox from "./admin/AdminInbox";

import Blog from "./Blog";
import BlogDetails from "./BlogDetails";
import AdminProfile from "./admin/AdminProfile";
import AdminResetPassword from "./admin/AdminResetPassword";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const Portfolio = lazy(() => import("./Portfolio"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
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
          path="/blog"
          element={
            <Suspense fallback={<BlogSkeleton />}>
              <Blog />
            </Suspense>
          }
        />

        <Route path="/blog/:slug" element={<BlogDetails />} />

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

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Projects */}
          <Route path="projects" element={<AdminProjects />} />
          <Route
            path="projects/categories"
            element={<AdminProjectCategories />}
          />
          <Route path="projects/new" element={<AdminProjectsForm />} />
          <Route
            path="projects/:id/edit"
            element={<AdminProjectsForm />}
          />

          {/* Blog */}
          <Route path="blog" element={<AdminBlog />} />
          <Route path="blog/categories" element={<AdminBlogCategories />} />
          <Route path="blog/new" element={<AdminBlogForm />} />
          <Route path="blog/:id/edit" element={<AdminBlogForm />} />

          {/* Inbox */}
          <Route path="inbox" element={<AdminInbox />} />

          {/* User menu */}
          <Route path="profile" element={<AdminProfile />} />
          <Route
            path="reset-password"
            element={<AdminResetPassword />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
