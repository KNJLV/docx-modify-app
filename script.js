let formButton = document.querySelector(".form__button");
let values = [];
keys = [
  "contract_number",
  "contract_date",
  "parent_surname",
  "parent_name",
  "parent_patronymic",
  "parent_phone",
  "parent_email",
  "registration_address",
  "passport_series",
  "passport_number",
  "passport_issue_date",
  "passport_place_of_issue",
  "children_surname",
  "children_name",
  "children_patronymic",
  "subject_name",
  "course_name",
  "rate_name",
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

  let initials = [values[2], values[3], values[4]];
  let parent_initials =
    initials[1][0] + "." + initials[2][0] + ". " + initials[0];
  values.push(parent_initials);

  let change_date = values[1].split("-");
  change_date = change_date[2] + "." + change_date[1] + "." + change_date[0];
  values[1] = change_date;

  let change_date2 = values[10].split("-");
  change_date2 =
    change_date2[2] + "." + change_date2[1] + "." + change_date2[0];
  values[10] = change_date2;

  let change_date3 = values[18].split("-");
  change_date3 =
    change_date3[2] + "." + change_date3[1] + "." + change_date3[0];
  values[18] = change_date3;

  let dict_values = keys.reduce((acc, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});

  let jsonData = JSON.stringify(dict_values);
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
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
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
  dict_values = {};
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
});
