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
  let inputs = document.querySelectorAll(".form__conteiner-input");

  for (let i = 0; i < inputs.length; i++) {
    values.push(inputs[i].value);
  }

  const initials = inputs[2].value.split(" ");
  const parent_initials =
    initials[1][0] + "." + initials[2][0] + "." + initials[0];
  values.push(parent_initials);

  let change_date = values[1].split("-");
  change_date = change_date[2] + "." + change_date[1] + "." + change_date[0];
  values[1] = change_date;

  let change_date2 = values[8].split("-");
  change_date2 =
    change_date2[2] + "." + change_date2[1] + "." + change_date2[0];
  values[8] = change_date2;

  let change_date3 = values[14].split("-");
  change_date3 =
    change_date3[2] + "." + change_date3[1] + "." + change_date3[0];
  values[14] = change_date3;

  const dict_values = keys.reduce((acc, key, index) => {
    acc[key] = values[index]; // Присваиваем значение из массива values по индексу
    return acc; // Возвращаем аккумулятор для следующей итерации
  }, {});

  const jsonData = JSON.stringify(dict_values);
  fetch("/api/send-data", {
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
      return response.blob(); // Получаем blob из ответа
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modified_contract.docx"; // Имя файла при скачивании
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });

  values = [];
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  document.location.reload();
});
