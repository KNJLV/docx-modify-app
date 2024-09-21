let formButton = document.querySelector(".form__button");
let values = [];
keys = [
  "contract_number",
  "contract_date",
  "parent_name",
  "parent_phone",
  "parent_email",
  "registration_address",
  "passport_series",
  "passport_number",
  "passport_issue_date",
  "passport_place_of_issue",
  "children_name",
  "subject_name",
  "rate_name",
  "course_name",
  "course_start_date",
  "course_duration",
  "course_price",
  "parent_initials",
];

formButton.addEventListener("click", function (e) {
  e.preventDefault();
  values = []; // Очищаем массив значений перед сбором данных
  const inputs = document.querySelectorAll(".form__conteiner-input");

  for (let i = 0; i < inputs.length; i++) {
    values.push(inputs[i].value);
  }

  const initials = inputs[2].value.split(" ");
  const parent_initials =
    initials[1][0] + "." + initials[2][0] + "." + initials[0];
  values.push(parent_initials);

  // Форматируем даты в нужный формат
  values[1] = formatDate(values[1]);
  values[8] = formatDate(values[8]);
  values[14] = formatDate(values[14]);

  const dict_values = keys.reduce((acc, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});

  const jsonData = JSON.stringify(dict_values);

  // Отправляем данные на сервер
  fetch("https://tools.navyk.school/api/send-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при загрузке файла");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modified_contract.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
});

function formatDate(dateStr) {
  const parts = dateStr.split("-");
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}
