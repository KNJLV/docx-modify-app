const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Обработка данных формы
app.post("/api/send-data", (req, res) => {
  const data = req.body;
  console.log("Полученные данные:", data);

  const templatePath = path.resolve(__dirname, "Contract.docx");

  // Проверка наличия шаблона
  if (!fs.existsSync(templatePath)) {
    console.error("Файл шаблона не найден:", templatePath);
    return res.status(404).send("Шаблон контракта не найден.");
  }

  let content;
  try {
    content = fs.readFileSync(templatePath, "binary");
  } catch (error) {
    console.error("Ошибка чтения файла шаблона:", error);
    return res.status(500).send("Ошибка при чтении файла шаблона.");
  }

  const zip = new PizZip(content);
  let doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    console.error("Ошибка создания Docxtemplater:", error);
    return res.status(500).send("Ошибка создания документа.");
  }

  // Заполняем шаблон данными
  try {
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

    doc.render();
  } catch (error) {
    console.error("Ошибка рендеринга документа:", error);
    return res.status(500).send("Ошибка при заполнении документа.");
  }

  const buf = doc.getZip().generate({ type: "nodebuffer" });

  const outputPath = path.resolve(__dirname, "output.docx");

  try {
    console.log("Длина буфера для записи:", buf.length); // Логируем длину буфера
    fs.writeFileSync(outputPath, buf);
  } catch (error) {
    console.error("Ошибка записи файла:", error);
    console.error(error.stack); // Логируем стек ошибок для большей информации
    return res.status(500).send("Ошибка при записи файла.");
  }

  // Проверяем наличие файла перед отправкой
  fs.access(outputPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Файл не найден для загрузки:", err);
      return res.status(500).send("Файл для загрузки не найден.");
    }

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="modified_contract.docx"'
    );
    res.download(outputPath, "modified_contract.docx");
  });
});

app.listen(8000, () => {
  console.log("Сервер запущен на: http://localhost:8000");
});
