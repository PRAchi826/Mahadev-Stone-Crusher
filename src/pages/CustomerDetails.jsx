

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin } from 'lucide-react';


const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    place:'',
    vehicle_number: '',
    material: '',
    quantity: '', 
    credit: '',
    debit: '',
     customVehicle: '',
  customMaterial: '',
  });
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();
  const materialOptions = ['60 mm','40 mm','10mm', '6 mm', '1/2 x 3/4', '3/8', 'crush sand', 'M-Sand','P-Sand', 'Other'];
const vehicleOptions = ['CU9684','EM8744', 'FL9684', 'GJ4078', 'EM9772', 'GJ2849', 'Other'];


  useEffect(() => {
    const fetchCustomer = async () => {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setCustomer(data);
    };

    const fetchTransactions = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      if (data) setTransactions(data);
    };

    fetchCustomer();
    fetchTransactions();
  }, [id]);

  const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
  const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  const netBalance = totalCredit - totalDebit;

  const handleGenerateClick = () => {
    setShowDateInputs(!showDateInputs);
  };

  const handleGetInvoice = () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates.");
      return;
    }

    // Navigate to /invoice with query parameters
    
    navigate(`/invoice/${customer.id}?from=${fromDate}&to=${toDate}`);

  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const credit = parseFloat(formData.credit) || 0;
    const debit = parseFloat(formData.debit) || 0;
    const lastBalance = transactions[0]?.balance || 0;
    const newBalance = lastBalance + credit - debit;

    const { data, error } = await supabase.from('transactions').insert([
      {
        customer_id: id,
        transaction_date: formData.date,
        place: formData.place || null,
        vehicle_number: formData.vehicle_number === 'Other' ? formData.customVehicle : formData.vehicle_number,
material: formData.material === 'Other' ? formData.customMaterial : formData.material,

        quantity: formData.quantity || null,
        
        credit,
        debit,
        balance: newBalance,
      },
    ]).select();

    // After inserting transaction
// You may calculate it or pass it from state



    if (!error && data) {
      setTransactions([data[0], ...transactions]);
      setShowForm(false);
      setFormData({
        date: '',
        place: '',
        vehicle_number: '',
        material: '',
        quantity: '',
        
        credit: '',
        debit: '',
      });
      console.log("Transaction added successfully:", data[0]);
    } else {
      console.error(error);
    }
  await supabase
  .from("customers")
  .update({ balance: newBalance })
  .eq('id',id);

  if (error) console.error("Customer update error:", error);
    
  };

  if (!customer) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto relative pb-20">
      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

      
      
      {/* Customer Info Block */}
      <div className="mb-10 border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
    <User className="w-5 h-5 text-blue-600" />
    {customer.name}
  </h2>

  <p className="flex items-center gap-2 text-gray-700 text-sm mb-2">
    <Phone className="w-4 h-4 text-green-600" />
    {customer.phone}
  </p>

  <p className="flex items-center gap-2 text-gray-700 text-sm">
    <MapPin className="w-4 h-4 text-red-600" />
    {customer.address}
  </p>
</div>

    

      {/* Generate Invoice Section */}
<div className="mb-8">
  <button
    onClick={handleGenerateClick}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Generate Invoice
  </button>

  {showDateInputs && (
    <div className="mt-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex flex-col text-sm text-gray-700 w-full sm:w-auto">
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700 w-full sm:w-auto">
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </label>
      </div>
      <button
        onClick={handleGetInvoice}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Get Invoice
      </button>
    </div>
  )}
</div>

    

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow-sm border">
          <p className="text-sm text-green-800">Total Credit</p>
          <p className="text-xl font-bold text-green-900">₹ {totalCredit.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow-sm border">
          <p className="text-sm text-red-800">Total Debit</p>
          <p className="text-xl font-bold text-red-900">₹ {totalDebit.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow-sm border">
          <p className="text-sm text-blue-800">Net Balance</p>
          <p className="text-xl font-bold text-blue-900">₹ {netBalance.toFixed(2)}</p>
        </div>
      </div>
     

      {/* Transactions Table */}
      <div className="md:hidden space-y-4">
  {transactions.map((txn) => (
    <div key={txn.id} className="p-4 border rounded bg-white shadow-sm">
      <p><span className="font-semibold">Date:</span> {txn.transaction_date}</p>
      <p><span className="font-semibold">Place:</span> {txn.place || '-'}</p>
      <p><span className="font-semibold">Vehicle No.:</span> {txn.vehicle_number || '-'}</p>
      <p><span className="font-semibold">Material:</span> {txn.material || '-'}</p>
      <p><span className="font-semibold">Qty:</span> {txn.quantity || '-'}</p>
      <p><span className="font-semibold text-green-600">Credit:</span> {txn.credit ? `₹ ${txn.credit}` : '-'}</p>
      <p><span className="font-semibold text-red-500">Debit:</span> {txn.debit ? `₹ ${txn.debit}` : '-'}</p>
      <p><span className="font-semibold">Balance:</span> {txn.balance}</p>
    </div>
  ))}
</div>

      <h3 className="hidden md:block text-xl font-semibold mb-2">Transactions</h3>
      <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-100 text-left sticky top-0">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Place</th>
              <th className="px-4 py-2">Vehicle No.</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Qty</th>
              
              <th className="px-4 py-2 text-green-600">Cost (credit)</th>
              <th className="px-4 py-2 text-red-500">Debit</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id} className="border-t">
                <td className="px-4 py-2">{txn.transaction_date}</td>
                <td className="px-4 py-2">{txn.place || '-'}</td>
                <td className="px-4 py-2">{txn.vehicle_number || '-'}</td>
                <td className="px-4 py-2">{txn.material || '-'}</td>
                <td className="px-4 py-2">{txn.quantity || '-'}</td>
                
                <td className="px-4 py-2 text-green-600">{txn.credit ? `₹ ${txn.credit}` : '-'} </td>
                <td className="px-4 py-2 text-red-500"> {txn.debit ? `₹ ${txn.debit}` : '-'}</td>
                <td className="px-4 py-2 font-semibold">{txn.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Form */}
    

      {showForm && (
  <form
    onSubmit={handleAddTransaction}
    className="fixed bottom-20 right-4 left-4 sm:right-4 sm:left-auto w-auto sm:max-w-md bg-white shadow-lg p-4 rounded-lg border z-50 space-y-4 overflow-y-auto max-h-[80vh]"
  >
    <h4 className="font-semibold text-lg mb-2">Add New Transaction</h4>

    <input
      type="date"
      value={formData.date}
      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      className="w-full p-2 border rounded"
      required
    />

    {/* Material Dropdown + Input */}
    <label className="block">
      <span className="text-sm">Material</span>
      <select
        value={formData.material}
        onChange={(e) =>
          setFormData({ ...formData, material: e.target.value })
        }
        className="w-full p-2 border rounded mt-1"
      >
        <option value="">Select Material</option>
        {materialOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {formData.material === 'Other' && (
        <input
          type="text"
          placeholder="Enter custom material"
          value={formData.customMaterial}
          onChange={(e) =>
            setFormData({ ...formData, customMaterial: e.target.value })
          }
          className="w-full p-2 border rounded mt-2"
        />
      )}
    </label>

    {/* Quantity */}
    <input
      type="number"
      placeholder="Quantity (optional)"
      value={formData.quantity}
      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
      className="w-full p-2 border rounded"
    />

    {/* Credit */}
    <input
      type="number"
      placeholder="Credit/Cost (Amount to Receive)"
      value={formData.credit}
      onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
      className="w-full p-2 border rounded"
    />

    {/* Debit */}
    <input
      type="number"
      placeholder="Debit (Payment Received)"
      value={formData.debit}
      onChange={(e) => setFormData({ ...formData, debit: e.target.value })}
      className="w-full p-2 border rounded"
    />

    {/* Vehicle Dropdown + Input */}
    <label className="block">
      <span className="text-sm">Vehicle Number</span>
      <select
        value={formData.vehicle_number}
        onChange={(e) =>
          setFormData({ ...formData, vehicle_number: e.target.value })
        }
        className="w-full p-2 border rounded mt-1"
      >
        <option value="">Select Vehicle</option>
        {vehicleOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {formData.vehicle_number === 'Other' && (
        <input
          type="text"
          placeholder="Enter custom vehicle number"
          value={formData.customVehicle}
          onChange={(e) =>
            setFormData({ ...formData, customVehicle: e.target.value })
          }
          className="w-full p-2 border rounded mt-2"
        />
      )}
    </label>

    {/* Place */}
    <input
      type="text"
      placeholder="Place"
      value={formData.place}
      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
      className="w-full p-2 border rounded"
    />

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancel Transaction
      </button>
      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Transaction
      </button>
    </div>
  </form>
)}


      {/* Fixed Add Button */}
      {!showForm && (
  <button
    onClick={() => setShowForm(true)}
    className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg z-50"
  >
    + Add Transaction
  </button>
)}

    </div>
  );
};

export default CustomerDetailsPage;





