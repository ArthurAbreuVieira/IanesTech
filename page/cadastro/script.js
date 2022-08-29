import user from "../../public/js/user.js";

if(user.checkUserLogin()) window.location = "/page/home/index.html"

const submit = document.getElementById("submit");
const name = document.getElementById("name");
const email = document.getElementById("email");
const [password, passwordConfirm] = document.querySelectorAll("input[type=password]");

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
  if (password.value !== passwordConfirm.value) {
    createError("As senhas não conferem!");
  } else if (!password.value || !passwordConfirm.value || !name.value || !email.value) {
    createError("Preencha todos os campos!");
  } else {
    const data = {
      name: name.value,
      email: email.value,
      password: password.value
    }

    if(!user.create(data)) {
      createError("O email já está cadastrado!");
      return false;
    }
    const container = document.getElementById("block");
    container.innerHTML = `
      <p>Cadastro realizado</p>
      <a class="square-nav-button active-square-nav-button" href="/page/login/index.html">Fazer login</a>
    `;
    container.classList.add("success");
  }
});