import React, { useEffect } from "react";
import jsPDF from "jspdf";

const Invoice = ({ order }) => {
  useEffect(() => {
    if (order) {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Invoice", 105, 20, null, null, "center");

      doc.setFontSize(12);
      doc.text(`Order No: ${order.orderNo}`, 20, 30);
      doc.text(`User: ${order.userName}`, 20, 40);
      doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 50);

      let y = 70;
      doc.text("Items:", 20, y);
      y += 10;

      order.orderDetails.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.menuName} - Qty: ${item.quantity}, Price: ₹${item.price.toFixed(2)}`,
          20,
          y
        );
        y += 10;
      });

      doc.text(`Total: ₹${order.totalAmount.toFixed(2)}`, 20, y + 10);
      doc.save(`Invoice-${order.orderNo}.pdf`);
    }
  }, [order]);

  return <div style={{ padding: "2rem" }}>Generating Invoice...</div>;
};

export default Invoice;
