import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    /*<nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-6 bg-blue-100 p-2 rounded-md">
  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
    <img
      src="/logo.jpg"
      alt="Logo"
      className="w-full h-full object-contain rounded-md"
    />
  </div>
  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
    Shetkari Seva Khatabook
  </h1>
</div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;*/
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
      <button
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
