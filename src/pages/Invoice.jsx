

/*
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from '../supabaseClient';

function InvoicePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const [transactions, setTransactions] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerAndTransactions = async () => {
      setLoading(true);

      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq('id', id)
        .single();

      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq('customer_id', id)
        .gte("transaction_date", fromDate)
        .lte("transaction_date", toDate)
        .order("transaction_date", { ascending: true });

      if (customerError || transactionError) {
        console.error(customerError || transactionError);
      } else {
        setCustomer(customerData);
        setTransactions(transactionData);
      }

      setLoading(false);
    };

    if (id && fromDate && toDate) {
      fetchCustomerAndTransactions();
    }
  }, [id, fromDate, toDate]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!customer) return <p className="p-4 text-red-600">Customer not found</p>;

  const handlePrint = () => {
    window.print();
  };

  const sendInvoiceToWhatsApp = (phoneNumber) => {
    const countryCode = '91';
    const message = `Hello ${customer.name}, here is your invoice link: ${window.location.href}`;
    const whatsappLink = `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
  const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  const finalBalance = totalCredit - totalDebit;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header /}
      <div className="flex flex-col md:flex-row md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mahadev Stone Crusher</h1>
          <p className="text-sm">Hanbarwadi, Karvir, Kolhapur</p>
          <p className="text-sm">Phone: +91-9975896633</p>
          
        </div>

        <div className="mt-4 md:mt-0">
          <p><strong>Invoice To:</strong> {customer.name}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Date Range:</strong> {formatDate(fromDate)} to {formatDate(toDate)}</p>
          <p><strong>Generated on:</strong> {formatDate(new Date())}</p>
        </div>
      </div>

      {/* Transactions Table /}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded shadow-sm">
        <table className="min-w-full text-sm bg-white border">
          <thead className="bg-gray-100 text-left sticky top-0">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Place</th>
              <th className="px-4 py-2">Vehicle No.</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2 text-green-600">Credit</th>
              <th className="px-4 py-2 text-red-500">Debit</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id} className="border-t">
                <td className="px-4 py-2">{formatDate(txn.transaction_date)}</td>
                <td className="px-4 py-2">{txn.place || '-'}</td>
                <td className="px-4 py-2">{txn.vehicle_number || '-'}</td>
                <td className="px-4 py-2">{txn.material || '-'}</td>
                <td className="px-4 py-2">{txn.quantity || '-'}</td>
                <td className="px-4 py-2 text-green-600">{txn.credit || '-'}</td>
                <td className="px-4 py-2 text-red-500">{txn.debit || '-'}</td>
                <td className="px-4 py-2 font-semibold">{txn.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary /}
      <div className="mt-6 border-t pt-4 text-right">
        <p><strong>Total Credit:</strong> ₹{totalCredit.toFixed(2)}</p>
        <p><strong>Total Debit:</strong> ₹{totalDebit.toFixed(2)}</p>
        <p className="text-lg font-bold mt-2">Final Balance: ₹{finalBalance.toFixed(2)}</p>
      </div>

      {/* Action Buttons /}
      <div className="print:hidden mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Print Invoice
        </button>
        <button
          onClick={() => sendInvoiceToWhatsApp(customer.phone)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Send Invoice to WhatsApp
        </button>
      </div>
    </div>
  );
}

export default InvoicePage;
*/


import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from '../supabaseClient';

function InvoicePage({ isPublicView = false }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const [transactions, setTransactions] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerAndTransactions = async () => {
      setLoading(true);

      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq('id', id)
        .single();

      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq('customer_id', id)
        .gte("transaction_date", fromDate)
        .lte("transaction_date", toDate)
        .order("transaction_date", { ascending: true });

      if (customerError || transactionError) {
        console.error(customerError || transactionError);
      } else {
        setCustomer(customerData);
        setTransactions(transactionData);
      }

      setLoading(false);
    };

    if (id && fromDate && toDate) {
      fetchCustomerAndTransactions();
    }
  }, [id, fromDate, toDate]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!customer) return <p className="p-4 text-red-600">Customer not found</p>;

  const handlePrint = () => {
    window.print();
  };

  const sendInvoiceToWhatsApp = (phoneNumber) => {
    const countryCode = '91';
    const message = `Hello ${customer.name},\nThis is your invoice from Mahadev Stone Crusher.\nPlease view it here: ${window.location.href}`;

    const whatsappLink = `https://wa.me/${countryCode}${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
  const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  const finalBalance = totalCredit - totalDebit;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mahadev Stone Crusher</h1>
          <p className="text-sm">Hanbarwadi, Karvir, Kolhapur</p>
          <p className="text-sm">Phone: +91-9975896633</p>
        </div>

        <div className="mt-4 md:mt-0">
          <p><strong>Invoice To:</strong> {customer.name}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Date Range:</strong> {formatDate(fromDate)} to {formatDate(toDate)}</p>
          <p><strong>Generated on:</strong> {formatDate(new Date())}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded shadow-sm">
        <table className="min-w-full text-sm bg-white border">
          <thead className="bg-gray-100 text-left sticky top-0">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Place</th>
              <th className="px-4 py-2">Vehicle No.</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2 text-green-600">Credit</th>
              <th className="px-4 py-2 text-red-500">Debit</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id} className="border-t">
                <td className="px-4 py-2">{formatDate(txn.transaction_date)}</td>
                <td className="px-4 py-2">{txn.place || '-'}</td>
                <td className="px-4 py-2">{txn.vehicle_number || '-'}</td>
                <td className="px-4 py-2">{txn.material || '-'}</td>
                <td className="px-4 py-2">{txn.quantity || '-'}</td>
                <td className="px-4 py-2 text-green-600">{txn.credit || '-'}</td>
                <td className="px-4 py-2 text-red-500">{txn.debit || '-'}</td>
                <td className="px-4 py-2 font-semibold">{txn.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 border-t pt-4 text-right">
        <p><strong>Total Credit:</strong> ₹{totalCredit.toFixed(2)}</p>
        <p><strong>Total Debit:</strong> ₹{totalDebit.toFixed(2)}</p>
        <p className="text-lg font-bold mt-2">Final Balance: ₹{finalBalance.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="print:hidden mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Print Invoice
        </button>

        {!isPublicView && (
          <button
            onClick={() => sendInvoiceToWhatsApp(customer.phone)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Send Invoice to WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}

export default InvoicePage;

