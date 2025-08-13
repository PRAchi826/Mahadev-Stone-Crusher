
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "/logo.jpeg"; // Adjust path if needed
import { supabase } from '../supabaseClient'; 


pdfMake.vfs = pdfFonts.vfs;

// Convert image file to Base64
function getBase64Image(url, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
  };
}

export async function createInvoiceDocDefinition(customer, fromDate, toDate, transactions) {
    return new Promise((resolve) =>{
    getBase64Image(logo, (logoDataUrl) => {
    const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

    const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
    const finalBalance = totalCredit - totalDebit;

    // Responsive font sizing
    const screenWidth = window.innerWidth;
    let baseFont = 12, headerFont = 20, subheaderFont = 15;
    if (screenWidth < 768) {
      baseFont = 12; headerFont = 16; subheaderFont = 12;
    } else if (screenWidth < 1024) {
      baseFont = 10; headerFont = 16; subheaderFont = 12;
    }

    const tableBody = [
      [
        { text: "Date", style: "tableHeader" },
        { text: "Place", style: "tableHeader" },
        { text: "Vehicle No.", style: "tableHeader" },
        { text: "Material", style: "tableHeader" },
        { text: "Qty (Brass)", style: "tableHeader" },
        { text: "Credit (cost)", style: "tableHeader" },
        { text: "Debit", style: "tableHeader" },
        { text: "Balance", style: "tableHeader" }
      ],
      ...transactions.map(t => [
        { text: formatDate(t.transaction_date), margin: [0, 3, 0, 3] },
        { text: t.place || "-", margin: [0, 3, 0, 3], noWrap: false },
        { text: t.vehicle_number || "-", margin: [0, 3, 0, 3] },
        { text: t.material || "-", margin: [0, 3, 0, 3], noWrap: false },
        { text: t.quantity || "-", margin: [0, 3, 0, 3] },
        { text: t.credit || "-", margin: [0, 3, 0, 3] },
        { text: t.debit || "-", margin: [0, 3, 0, 3] },
        { text: t.balance, margin: [0, 3, 0, 3],noWrap: false }
      ])
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 40, 20, 40],
      content: // Header: Logo + Business Name + Details (left) | Invoice Info (right)
[
  // Top row: logo + company name
  {
    columns: [
      {
        image: logoDataUrl,
        fit: [100, 60],
        width: 70,
        margin: [0, 0, 0, 0]
      },
      {
        text: "Mahadev Stone Crusher",
        style: "header",
        alignment: "left",
        width: "*", // takes remaining width
        margin: [0, 20, 0, 0],
        color: "#1a237e" // dark blue for professional look
      }
    ],
    columnGap: 10,
    margin: [0, 0, 0, 5]
  },

  // Bottom row: left column - address; right column - invoice info
  {
    columns: [
      {
        stack: [
          { text: "Hanbarwadi, Karvir, Kolhapur", fontSize: baseFont, color: "#333333" },
          { text: "Phone: +91-9975896633", fontSize: baseFont, margin: [0, 2, 0, 0], color: "#333333" }
        ],
      },
      {
        stack: [
          { text: "Invoice To:", bold: true, fontSize: baseFont, color: "#1a237e", margin: [0, 0, 0, 2] },
          { text: `${customer.name}`, bold: true, fontSize: baseFont, color: "#000000", margin: [0, 0, 0, 2] },
          { text: `Phone: ${customer.phone}`, fontSize: baseFont, color: "#555555", margin: [0, 0, 0, 2] },
          { text: `Date Range: ${formatDate(fromDate)} - ${formatDate(toDate)}`, fontSize: baseFont, color: "#555555", margin: [0, 0, 0, 2] },
          { text: `Generated on: ${formatDate(new Date())}`, fontSize: baseFont, color: "#555555", margin: [0, 0, 0, 2] }
        ],
        alignment: "left",
        margin: [60, 0, 0, 10]
      }
    ],
    columnGap: 20,
    margin: [0, 0, 0, 10],
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: "#dddddd" } // subtle bottom line
    ]
  },


        { text: "Transactions", style: "subheader" },

        {
          table: {
            headerRows: 1,
            widths: [70, 70, 60, 70, 30, 60, 60, "*"],
            body: tableBody
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? "#eeeeee" : null;
            },
            hLineWidth: function (i) { return 0.5; },
            vLineWidth: function (i) { return 0.5; },
            paddingLeft: function (i) { return 5; },
            paddingRight: function (i) { return 5; },
            paddingTop: function (i) { return 3; },
            paddingBottom: function (i) { return 3; }
          }
        },

        // Summary section at right side
{
  columns: [
    {  width: "*", text: ""  }, // empty left column to push summary to the right
    {  width: "auto",
      stack: [
        { text: "Summary", style: "subheader" },
        { text: `Total Credit: ₹${totalCredit.toFixed(2)}`, fontSize: baseFont, margin: [0, 2, 0, 2] },
        { text: `Total Debit: ₹${totalDebit.toFixed(2)}`, fontSize: baseFont, margin: [0, 2, 0, 2] },
        { text: `Final Balance: ₹${finalBalance.toFixed(2)}`, bold: true, fontSize: baseFont + 2, margin: [0, 5, 0, 2] }
      ],
      
      style: "summaryBox",
      alignment: "left"
    }
  ],
  columnGap: 20
},

        { text: "\nThank you for your business!", italics: true, fontSize: baseFont }
      ],
      styles: {
        header: { fontSize: headerFont, bold: true },
        subheader: { fontSize: subheaderFont, bold: true, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: baseFont, fillColor: "#eeeeee" },
         summaryBox: {
    margin: [0, 0, 0, 0],
    border: [true, true, true, true],
    borderColor: "#1a237e",
    fillColor: "#f3f3f3",
    padding: [10, 10, 10, 10]
  }
      },
      defaultStyle: { fontSize: baseFont }
    };
resolve(docDefinition);
    
  });
}
    )}


// Print function
export async function handlePrint(customer, fromDate, toDate, transactions) {
  const docDefinition = await createInvoiceDocDefinition(customer, fromDate, toDate, transactions);
  pdfMake.createPdf(docDefinition).download(`Invoice-${customer.name}.pdf`);
}

// Send link to WhatsApp
export async function sendInvoiceWhatsApp(customer, fromDate, toDate, transactions) {
  try {
    // 1️⃣ Generate the PDF blob
    const docDefinition = await createInvoiceDocDefinition(customer, fromDate, toDate, transactions);
    const blob = await new Promise((resolve) => pdfMake.createPdf(docDefinition).getBlob(resolve));

    // 2️⃣ Upload to Supabase Storage
    const safeCustomerName = customer.name.replace(/[^a-zA-Z0-9]/g, "_");
const fileName = `Invoice-${safeCustomerName}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('Invoices') // bucket must exist and be public
      .upload(fileName, blob, { contentType: 'application/pdf' });

    if (uploadError) throw uploadError;

    // 3️⃣ Get public URL
    const { data } = supabase.storage.from('Invoices').getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    // 4️⃣ Open WhatsApp with the public PDF link
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Hello ${customer.name}, here is your invoice: ${publicUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");

  } catch (err) {
    console.error("Error sending invoice via WhatsApp:", err.message || err);
  }
}



