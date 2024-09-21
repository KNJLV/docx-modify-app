const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/send-data", (req, res) => {
  const data = req.body;
  console.log(data);

  const templatePath = path.resolve(__dirname, "Contract.docx");
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);

  doc.setData({
    contract_number: data.contract_number,
    contract_date: data.contract_date,
    parent_name: data.parent_name,
    parent_phone: data.parent_phone,
    parent_email: data.parent_email,
    registration_address: data.registration_address,
    passport_series: data.passport_series,
    passport_number: data.passport_number,
    passport_issue_date: data.passport_issue_date,
    passport_place_of_issue: data.passport_place_of_issue,
    children_name: data.children_name,
    subject_name: data.subject_name,
    rate_name: data.rate_name,
    course_name: data.course_name,
    course_start_date: data.course_start_date,
    course_duration: data.course_duration,
    course_price: data.course_price,
    parent_initials: data.parent_initials,
  });

  try {
    doc.render();
  } catch (error) {
    console.error("Error rendering document:", error);
    return res.status(500).send("Ошибка при заполнении документа.");
  }

  try {
    const buf = doc.getZip().generate({ type: "nodebuffer" });
    const outputPath = path.resolve(__dirname, "output.docx");
    fs.writeFileSync(outputPath, buf);
    console.log("Файл успешно записан по пути:", outputPath);
  } catch (error) {
    console.error("Ошибка при записи файла:", error.message);
    return res.status(500).send("Ошибка при записи файла.");
  }

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="modified_contract.docx"'
  );
  res.download(outputPath, "modified_contract.docx");
});

app.listen(8000, () => {
  console.log("Server started on: http://localhost:8000");
});
