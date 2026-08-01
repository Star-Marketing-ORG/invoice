// invoice/pdf/pdf.template.ts
import PDFDocument from "pdfkit";
import { InvoicePdfData } from "./pdf.types";

export function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Colors
      const primary = "#4F46E5";
      const primaryDark = "#3730A3";
      const dark = "#111827";
      const gray = "#6B7280";
      const lightGray = "#F3F4F6";
      const border = "#E5E7EB";
      const white = "#FFFFFF";
      const success = "#059669";
      const danger = "#DC2626";

      const pageWidth = doc.page.width;
      const margin = 45;

      // ===== HEADER BAR =====
      doc.rect(0, 0, pageWidth, 130).fill(primaryDark);
      
      // Company Name
      doc
        .fontSize(32)
        .font("Helvetica-Bold")
        .fillColor(white)
        .text("Invoice Ready", margin, 30);

      // Tagline
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(primary)
        .text("Smart Invoicing for Modern Businesses", margin, 68);

      // Invoice Title
      doc
        .fontSize(26)
        .font("Helvetica-Bold")
        .fillColor(white)
        .text("INVOICE", pageWidth - margin - 200, 30, { align: "right", width: 200 });

      // Invoice Number in header
      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor(primary)
        .text(`#${data.invoiceNumber}`, pageWidth - margin - 200, 60, { align: "right", width: 200 });

      // ===== INVOICE META (below header) =====
      const metaY = 140;
      
      // Left: Bill To
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(gray)
        .text("BILL TO", margin, metaY)
        .moveDown(0.5)
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor(dark)
        .text(data.customerName)
        .fontSize(10)
        .font("Helvetica")
        .fillColor(gray)
        .text(data.customerEmail)
        .text(data.customerPhone);

      if (data.customerAddress) {
        doc.text(data.customerAddress);
      }

      // Right: Invoice Details Box
      const boxX = pageWidth - margin - 220;
      const boxWidth = 220;
      
      doc.rect(boxX, metaY, boxWidth, 110).fill(lightGray).stroke(border);
      doc.rect(boxX, metaY, boxWidth, 25).fill(primary);

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(white)
        .text("INVOICE DETAILS", boxX + 10, metaY + 7);

      const details = [
        { label: "Invoice No", value: data.invoiceNumber },
        { label: "Issue Date", value: data.issueDate },
        { label: "Due Date", value: data.dueDate },
        { label: "Status", value: data.status, color: data.status === "OVERDUE" ? danger : success },
      ];

      let detailY = metaY + 35;
      details.forEach((detail) => {
        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .fillColor(gray)
          .text(detail.label, boxX + 10, detailY)
          .font("Helvetica")
          .fillColor(detail.color || dark)
          .text(detail.value, boxX + 80, detailY);
        detailY += 18;
      });

      // ===== ITEMS TABLE =====
      const tableTop = metaY + 130;
      const colX = margin;
      const colWidths = {
        item: 180,
        qty: 55,
        price: 80,
        tax: 60,
        discount: 70,
        total: 90,
      };

      const colPositions = {
        item: colX,
        qty: colX + colWidths.item,
        price: colX + colWidths.item + colWidths.qty,
        tax: colX + colWidths.item + colWidths.qty + colWidths.price,
        discount: colX + colWidths.item + colWidths.qty + colWidths.price + colWidths.tax,
        total: colX + colWidths.item + colWidths.qty + colWidths.price + colWidths.tax + colWidths.discount,
      };

      // Table Header
      doc.rect(margin, tableTop, pageWidth - margin * 2, 28).fill(dark);

      const headerY = tableTop + 8;
      doc.fontSize(8).font("Helvetica-Bold").fillColor(white);
      doc.text("SERVICE / DESCRIPTION", colPositions.item + 5, headerY);
      doc.text("QTY", colPositions.qty, headerY, { align: "center", width: colWidths.qty });
      doc.text("UNIT PRICE", colPositions.price, headerY, { align: "right", width: colWidths.price });
      doc.text("TAX", colPositions.tax, headerY, { align: "center", width: colWidths.tax });
      doc.text("DISC.", colPositions.discount, headerY, { align: "right", width: colWidths.discount });
      doc.text("TOTAL", colPositions.total, headerY, { align: "right", width: colWidths.total });

      // Table Rows
      let rowY = tableTop + 32;
      doc.font("Helvetica").fontSize(8);

      data.items.forEach((item, index) => {
        const bgColor = index % 2 === 0 ? white : lightGray;
        const rowHeight = 22;

        doc.rect(margin, rowY, pageWidth - margin * 2, rowHeight).fill(bgColor);

        doc.fillColor(dark);
        doc.font("Helvetica-Bold").text(item.serviceName, colPositions.item + 5, rowY + 5, { width: colWidths.item - 10 });
        doc.font("Helvetica").text(item.quantity.toString(), colPositions.qty, rowY + 5, { align: "center", width: colWidths.qty });
        doc.text(`₹${item.unitPrice.toLocaleString("en-IN")}`, colPositions.price, rowY + 5, { align: "right", width: colWidths.price });
        doc.text(`${item.taxRate}%`, colPositions.tax, rowY + 5, { align: "center", width: colWidths.tax });

        if (item.discount > 0) {
          doc.fillColor(danger).text(`-₹${item.discount.toLocaleString("en-IN")}`, colPositions.discount, rowY + 5, { align: "right", width: colWidths.discount });
        } else {
          doc.fillColor(gray).text("—", colPositions.discount, rowY + 5, { align: "right", width: colWidths.discount });
        }

        doc.fillColor(dark).font("Helvetica-Bold")
          .text(`₹${item.total.toLocaleString("en-IN")}`, colPositions.total, rowY + 5, { align: "right", width: colWidths.total });

        // Border bottom
        doc.moveTo(margin, rowY + rowHeight).lineTo(pageWidth - margin, rowY + rowHeight).stroke(border);

        rowY += rowHeight;
      });

      // ===== TOTALS =====
      rowY += 15;
      const totalsX = colPositions.discount;
      const totalsWidth = pageWidth - margin - totalsX;

      const addTotalLine = (label: string, value: string, isBold: boolean = false, color: string = dark) => {
        doc
          .fontSize(isBold ? 11 : 9)
          .font(isBold ? "Helvetica-Bold" : "Helvetica")
          .fillColor(color);
        doc.text(label, totalsX, rowY);
        doc.text(value, totalsX, rowY, { align: "right", width: totalsWidth });
        rowY += isBold ? 22 : 18;
      };

      addTotalLine("Subtotal", `₹${data.subtotal.toLocaleString("en-IN")}`, false, gray);

      if (data.discount > 0) {
        addTotalLine("Discount", `-₹${data.discount.toLocaleString("en-IN")}`, false, danger);
      }

      if (data.tax > 0) {
        addTotalLine("Tax", `₹${data.tax.toLocaleString("en-IN")}`, false, gray);
      }

      // Separator
      rowY += 3;
      doc.moveTo(totalsX, rowY).lineTo(pageWidth - margin, rowY).stroke(dark).lineWidth(1.5);
      rowY += 8;

      addTotalLine("Total", `₹${data.total.toLocaleString("en-IN")}`, true, dark);

      // Paid & Balance
      rowY += 10;
      doc.moveTo(totalsX, rowY).lineTo(pageWidth - margin, rowY).stroke(border);
      rowY += 8;

      addTotalLine("Paid", `₹${data.totalPaid.toLocaleString("en-IN")}`, false, success);
      addTotalLine("Balance Due", `₹${data.remainingBalance.toLocaleString("en-IN")}`, true, danger);

      // ===== NOTES & TERMS =====
      rowY += 20;

      if (data.notes) {
        if (rowY > doc.page.height - 200) {
          doc.addPage();
          rowY = 50;
        }

        doc.rect(margin, rowY, pageWidth - margin * 2, 1).fill(primary);
        rowY += 10;

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor(dark)
          .text("Notes", margin, rowY);
        rowY += 18;

        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(gray)
          .text(data.notes, margin, rowY, { width: pageWidth - margin * 2, lineGap: 4 });
        rowY = doc.y + 20;
      }

      if (data.termsConditions) {
        if (rowY > doc.page.height - 200) {
          doc.addPage();
          rowY = 50;
        }

        doc.rect(margin, rowY, pageWidth - margin * 2, 1).fill(primary);
        rowY += 10;

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor(dark)
          .text("Terms & Conditions", margin, rowY);
        rowY += 18;

        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor(gray)
          .text(data.termsConditions, margin, rowY, { width: pageWidth - margin * 2, lineGap: 4 });
      }

      // ===== FOOTER =====
      const footerY = doc.page.height - 50;
      doc.rect(0, footerY, pageWidth, 50).fill(dark);

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(primary)
        .text("Invoice Ready", margin, footerY + 12)
        .fillColor(gray)
        .text("Smart Invoicing for Modern Businesses", margin, footerY + 24);

      doc
        .fontSize(8)
        .fillColor(gray)
        .text("Thank you for your business!", pageWidth - margin - 200, footerY + 18, { align: "right", width: 200 });

      // Finalize
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}