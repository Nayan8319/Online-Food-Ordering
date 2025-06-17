import jsPDF from "jspdf";

const InvoiceGenerator = ({ order, userName }) => {
  const generate = () => {
    const doc = new jsPDF({ unit: "px" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const rupee = "₹"; // Proper Unicode symbol

    // Header
    doc.setFillColor("#FFD54F");
    doc.rect(0, 0, pageWidth, 80, "F");
    doc.setFontSize(24).setTextColor("#000");
    doc.text("INVOICE", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(14).setTextColor("#333");
    doc.text(`Invoice #: ${order.orderNo}`, 40, 100);
    doc.text(`Customer: ${userName}`, 40, 120);
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 40, 140);

    // Table Headers
    let y = 180;
    doc.setFontSize(13).setTextColor("#000");
    doc.text("Item", 40, y);
    doc.text("Qty", 250, y);
    doc.text("Price", 300, y);
    doc.text("Amount", 380, y);
    doc.line(40, y + 5, pageWidth - 40, y + 5);

    // Table Rows
    y += 20;
    order.orderDetails.forEach((item) => {
      const amount = item.quantity * item.price;
      doc.text(item.menuName, 40, y);
      doc.text(`${item.quantity}`, 250, y);
      doc.text(`${rupee}${item.price.toFixed(2)}`, 300, y);
      doc.text(`${rupee}${amount.toFixed(2)}`, 380, y);
      y += 20;
    });

    // Summary
    y += 20;
    doc.setFontSize(14);
    doc.text(`Total Paid: ${rupee}${order.totalAmount.toFixed(2)}`, 40, y);

    // Footer
    y += 40;
    doc.setFontSize(12).setTextColor("#666");
    doc.text("Thank you for your business!", 40, y);

    doc.save(`Invoice-${order.orderNo}.pdf`);
  };

  return { generate };
};

export default InvoiceGenerator;
