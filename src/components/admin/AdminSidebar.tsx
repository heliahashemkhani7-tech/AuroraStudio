import { supabase } from "@/lib/supabace";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/account/auth");
  };

  return (
    <aside className="w-64 min-h-screen border-r p-6 text-text z-6">
      <h2 className="text-xl font-bold mb-8">Aurora Admin</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashbord">Dashboard</Link>

        <Link to="/dashbord/projects">Projects</Link>

        <button type="button" onClick={handleLogout} className="text-left">
          Logout
        </button>
      </nav>
    </aside>
  );
}
