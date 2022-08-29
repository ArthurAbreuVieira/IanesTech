import course from "./public/js/course.js";
import user from "./public/js/user.js";


course.___setCourses___();
localStorage.setItem("lastDBindex", parseInt(localStorage.getItem("lastDBindex") ?? 0));


if(user.checkUserLogin()) {
  const headerNav = document.querySelector("header nav ul");
  headerNav.innerHTML = `
    <li><a href="/" class="square-nav-button">Inicio</a></li>
    <li><a href="/page/certificates/index.html" class="square-nav-button">Certificados</a></li>
    <li><a href="/page/home/index.html" class="square-nav-button">Meus cursos</a></li>
    <li><button class="square-nav-button" data-js="logoff">Sair</button></li>
  `;
  const logoffButton = document.querySelector("[data-js=logoff]");
  logoffButton.addEventListener("click", () => user.logoff());
}