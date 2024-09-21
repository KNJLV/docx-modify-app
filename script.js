formButton.addEventListener("click", function (e) {
  e.preventDefault();
  values = [];
  const inputs = document.querySelectorAll(".form__conteiner-input");

  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].value) {
      console.error(`Поле ${inputs[i].name} не заполнено!`);
      return; // Прекращаем выполнение, если какое-либо поле не заполнено
    }
    values.push(inputs[i].value);
  }

  const initials = inputs[2].value.split(" ");
  const parent_initials =
    initials[1][0] + "." + initials[2][0] + "." + initials[0];
  values.push(parent_initials);

  // Форматируем даты
  values[1] = formatDate(values[1]); // contract_date
  values[8] = formatDate(values[8]); // passport_issue_date
  values[14] = formatDate(values[14]); // course_start_date

  const dict_values = keys.reduce((acc, key, index) => {
    acc[key] = values[index] || ""; // Добавляем пустую строку, если значение отсутствует
    return acc;
  }, {});

  const jsonData = JSON.stringify(dict_values);

  // Отправка данных
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
