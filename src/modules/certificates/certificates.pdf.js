const PDFDocument = require("pdfkit");

function generateCertificatePdf(studentName, courseTitle, issueDate) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(16).text("This certifies that", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(24).text(studentName, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text("has successfully completed the course", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(22).text(courseTitle, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Issued on ${issueDate.toDateString()}`, { align: "center" });

    doc.end();
  });
}

module.exports = { generateCertificatePdf };
