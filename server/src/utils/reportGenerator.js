import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const streamPdfReport = ({ title, rows }, res) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text(title, { underline: true }).moveDown();
  rows.forEach((row) => doc.fontSize(11).text(row));
  doc.end();
};

export const streamExcelReport = async ({ title, headers, rows }, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);
  sheet.addRow(headers);
  rows.forEach((row) => sheet.addRow(row));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
};
