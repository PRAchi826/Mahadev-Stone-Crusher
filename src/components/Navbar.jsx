import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
<nav className="bg-blue-400 text-white px-4 py-3 shadow-md">
  <div className="flex flex-wrap items-center justify-between px-3">
    
    {/* Left - Logo + Title */}
    <div className="flex items-center gap-4">
      <img
        src="/logo.jpeg"
        alt="Logo"
        className="h-18 w-18 object-cover rounded-md"
      />
      <h1 className="text-lg text-white print:text-black md:text-xl font-bold">Mahadev Stone Crusher Khatabook
      </h1>
    </div>

    {/* Right - Button */}
    <div className="mt-2 sm:mt-0">
      <button onClick={handleLogout}
        className="print:hidden bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
      >
        Logout
      </button>
    </div>
  </div>
</nav>

  );
};
export default Navbar;
