import jsPDF from "jspdf";

interface ReceiptData {
  receiptNumber: string;
  paymentDate: string;
  courseName: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  totalPaid: number;
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
}

export const generatePaymentReceipt = (data: ReceiptData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(255, 87, 34); // Primary orange color
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("New Tech Hub International", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Payment Receipt", pageWidth / 2, 32, { align: "center" });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Receipt details box
  doc.setFillColor(249, 250, 251);
  doc.rect(15, 50, pageWidth - 30, 25, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Receipt Number:", 20, 60);
  doc.text("Date:", 120, 60);
  
  doc.setFont("helvetica", "normal");
  doc.text(data.receiptNumber, 55, 60);
  doc.text(data.paymentDate, 135, 60);
  
  // Customer details
  let yPos = 90;
  
  if (data.customerName || data.customerEmail) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (data.customerName) {
      doc.text(`Name: ${data.customerName}`, 20, yPos);
      yPos += 7;
    }
    if (data.customerEmail) {
      doc.text(`Email: ${data.customerEmail}`, 20, yPos);
      yPos += 7;
    }
    yPos += 10;
  }
  
  // Payment details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Details", 20, yPos);
  yPos += 15;
  
  // Table header
  doc.setFillColor(255, 87, 34);
  doc.rect(15, yPos - 5, pageWidth - 30, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Description", 20, yPos + 2);
  doc.text("Amount", pageWidth - 40, yPos + 2, { align: "right" });
  
  // Table content
  doc.setTextColor(0, 0, 0);
  yPos += 15;
  
  doc.setFont("helvetica", "normal");
  doc.text(`Course: ${data.courseName}`, 20, yPos);
  yPos += 10;
  
  doc.text(`Installment ${data.installmentNumber} of ${data.totalInstallments}`, 20, yPos);
  doc.text(`₦${data.amount.toLocaleString()}`, pageWidth - 40, yPos, { align: "right" });
  yPos += 15;
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;
  
  // Summary
  doc.setFont("helvetica", "bold");
  doc.text("Amount Paid:", 100, yPos);
  doc.text(`₦${data.amount.toLocaleString()}`, pageWidth - 40, yPos, { align: "right" });
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text("Total Paid to Date:", 100, yPos);
  doc.text(`₦${data.totalPaid.toLocaleString()}`, pageWidth - 40, yPos, { align: "right" });
  yPos += 8;
  
  doc.text("Remaining Balance:", 100, yPos);
  doc.text(`₦${(data.totalAmount - data.totalPaid).toLocaleString()}`, pageWidth - 40, yPos, { align: "right" });
  yPos += 20;
  
  // Status badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth / 2 - 25, yPos, 50, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("PAID", pageWidth / 2, yPos + 8, { align: "center" });
  
  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const footerY = doc.internal.pageSize.getHeight() - 30;
  
  doc.text("New Tech Hub International", pageWidth / 2, footerY, { align: "center" });
  doc.text("5 Dalaba Street, Wuse Zone 5, Abuja", pageWidth / 2, footerY + 5, { align: "center" });
  doc.text("Phone: +2348159153454 | Email: info@newtechhub.com", pageWidth / 2, footerY + 10, { align: "center" });
  doc.text("Thank you for your payment!", pageWidth / 2, footerY + 18, { align: "center" });
  
  // Save the PDF
  doc.save(`receipt-${data.receiptNumber}.pdf`);
};
