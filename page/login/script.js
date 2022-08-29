import user from "../../public/js/user.js";

const submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");

function createError(msg) {
  const form = document.getElementById("form");

  if (document.querySelector(".error")) {
    document.querySelector(".error p").innerText = msg;
  } else {
    const errorBox = document.createElement("div");
    const errorMsg = document.createElement("p");
    errorBox.classList.add("error")
    errorMsg.innerText = msg;
    errorBox.appendChild(errorMsg);
    form.insertAdjacentElement("beforebegin", errorBox);
  }

}

submit.addEventListener("click", e => {
  e.preventDefault();
  
  if(user.login({email: email.value, password: password.value})) window.location = "/page/home";
  else createError("Dados inválidos!");
});