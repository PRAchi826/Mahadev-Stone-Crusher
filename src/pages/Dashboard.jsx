/*

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import AddCustomerModal from "../components/AddCustomerModal";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select();
    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      setCustomers(data);
    }
  };

  const applyFilter = (list) => {
    switch (filterBy) {
      case "youWillGive":
        return list.filter((c) => c.balance < 0);
      case "youWillGet":
        return list.filter((c) => c.balance > 0);
      case "settled":
        return list.filter((c) => c.balance === 0);
      default:
        return list;
    }
  };

  const applySort = (list) => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "highest":
          return Math.abs(b.balance) - Math.abs(a.balance);
        case "lowest":
          return Math.abs(a.balance) - Math.abs(b.balance);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "latest":
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  };

  const filteredCustomers = applySort(
    applyFilter(
      customers.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4 relative">
      {/* Search, Filter, Sort, and Total Customers in One Line /}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="all">Filter: All</option>
          <option value="youWillGive">You Will Give</option>
          <option value="youWillGet">You Will Get</option>
          <option value="settled">Settled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="latest">Sort: Latest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Least Amount</option>
        </select>

        <span className="text-sm font-medium text-gray-700">
          Total: {filteredCustomers.length}
        </span>
      </div>

      {/* Customer Table /}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow mb-28">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-medium sticky top-0 z-10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-gray-800">{c.name}</td>
                <td
                  className={`p-4 font-medium ${
                    c.balance > 0 ? "text-green-700" : c.balance < 0 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  ₹{c.balance.toLocaleString()}
                </td>
                <td className="p-4">
                  <Link
                    to={`/customer/${c.id}`}
                    className="text-red-600 hover:underline font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No matching customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Button - Fixed Bottom Center /}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md shadow-lg"
        >
          + Add Customer
        </button>
      </div>

      {/* Modal /}
      {showModal && (
        <AddCustomerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCustomerAdded={fetchCustomers}
        />
      )}
    </div>
  );
};

export default Dashboard;*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AddCustomerModal from "../components/AddCustomerModal";
import { Search, Filter, SortAsc } from "lucide-react";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [willGive, setWillGive] = useState(0);
const [willGet, setWillGet] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, []);

  /*const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select();
    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      setCustomers(data);
    }
  };*/
  const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select(`
      id,
      name,
      phone,
      address,
      created_at,
      transactions (
        credit,
        debit
      )
    `);

  if (error) {
    console.error("Error fetching customers:", error);
  } else {
    // Calculate balance for each customer
    const customersWithBalance = data.map((customer) => {
      const totalCredit = customer.transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
      const totalDebit = customer.transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
      const balance = totalCredit - totalDebit;

      return {
        ...customer,
        balance,
      };
    });

    setCustomers(customersWithBalance);

    const totalWillGive = customersWithBalance
      .filter(c => c.balance < 0)
      .reduce((sum, c) => sum + Math.abs(c.balance), 0);

    const totalWillGet = customersWithBalance
      .filter(c => c.balance > 0)
      .reduce((sum, c) => sum + c.balance, 0);

    setWillGive(totalWillGive);
    setWillGet(totalWillGet);
  }
};


  const applyFilter = (list) => {
    switch (filterBy) {
      case "youWillGive":
        return list.filter((c) => c.balance < 0);
      case "youWillGet":
        return list.filter((c) => c.balance > 0);
      case "settled":
        return list.filter((c) => c.balance === 0);
      default:
        return list;
    }
  };

  const deleteCustomer = async (customerId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer? This will also delete ALL their transactions."
  );

  if (!confirmDelete) return;

  // 1️⃣ Delete all transactions of this customer first (FK constraint)
  await supabase
    .from("transactions")
    .delete()
    .eq("customer_id", customerId);

  // 2️⃣ Delete the customer
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) {
    alert("Error deleting customer");
    console.error(error);
  } else {
    alert("Customer deleted successfully");
    fetchCustomers(); // Refresh UI
  }
};


  const applySort = (list) => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "highest":
          return Math.abs(b.balance) - Math.abs(a.balance);
        case "lowest":
          return Math.abs(a.balance) - Math.abs(b.balance);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "latest":
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  };

  const filteredCustomers = applySort(
    applyFilter(
      customers.filter((c) =>
        `${c.name} ${c.phone || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );
  const navigate = useNavigate();


  const handleCustomerClick = (customer) => {
    console.log("Customer clicked:", customer);
    navigate(`/customers/${customer.id}`);
  };

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4 relative">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow text-center font-semibold">
          💰 You Will Give:{`₹${willGive}`}
        </div>
        <div className="bg-green-100 text-green-700 p-4 rounded-xl shadow text-center font-semibold">
          💸 You Will Get: {`₹${willGet}`}
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow text-center font-semibold">
          👥 Total Customers: {customers.length}
        </div>
      </div>

      
      <div className="mb-4">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-1">
    <div className="text-sm font-semibold text-gray-600">Search Customers</div>
    <div className="text-sm font-semibold text-gray-600">Filter by</div>
    <div className="text-sm font-semibold text-gray-600">Sort by</div>
  </div>

  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
    {/* Search Bar */}
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Filter Dropdown */}
    <div className="relative w-full sm:max-w-xs">
      <Filter className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="pl-8 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All</option>
        <option value="youWillGive">You Will Give</option>
        <option value="youWillGet">You Will Get</option>
        <option value="settled">Settled</option>
      </select>
    </div>

    {/* Sort Dropdown */}
    <div className="relative w-full sm:max-w-xs">
      <SortAsc className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="pl-8 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="name">Name</option>
        <option value="highest">Highest Amount</option>
        <option value="lowest">Least Amount</option>
      </select>
    </div>
  </div>
</div>


      {/* Customer Table */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow mb-28">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-medium sticky top-0 z-10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id}
                className="cursor-pointer hover:bg-gray-100 transition-colors">
                <td  onClick={() => handleCustomerClick(c)} className="p-4 text-gray-800">{c.name}</td>
                <td
                  onClick={() => handleCustomerClick(c)}
                  className={`p-4 font-medium ${
                    c.balance > 0
                      ? "text-green-700"
                      : c.balance < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  ₹{c.balance.toLocaleString()}
                </td>
                <td className="p-4">
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click navigation
        deleteCustomer(c.id);
      }}
      className="cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </td>
               
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No matching customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 rounded-md shadow-lg"
        >
          + Add Customer
        </button>
      </div>

      {showModal && (
        <AddCustomerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCustomerAdded={fetchCustomers}
        />
      )}
    </div>
  );
};

export default Dashboard;




