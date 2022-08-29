import course from "../../public/js/course.js";
import user from "../../public/js/user.js"

const query = new URLSearchParams(location.search);
const courseId = parseInt(query.get("course"));
const courseData = course.find(courseId);

if(!courseData) window.location = "/";

if(user.checkUserLogin()) {
  const headerNav = document.querySelector("header nav ul");
  headerNav.innerHTML = `
    <li><a href="/" class="active-square-nav-button square-nav-button">Inicio</a></li>
    <li><a href="/page/certificates/" class="active-square-nav-button square-nav-button">Certificados</a></li>
    <li><a href="/page/home/" class="active-square-nav-button square-nav-button">Meus cursos</a></li>
    <li><button class="active-square-nav-button square-nav-button" data-js="logoff">Sair</button></li>
  `;
  const logoffButton = document.querySelector("[data-js=logoff]");
  logoffButton.addEventListener("click", () => user.logoff());
}

const title = document.querySelectorAll("[data-js=title]");
const thumbnail = document.querySelector("[data-js=thumbnail]");
const grid = document.querySelector("[data-js=grid]");

title.forEach(el => el.innerText = courseData.title);
thumbnail.src = `../../public/img/${courseData.thumbnail}`;
grid.innerHTML = "";

courseData.grid.forEach(el => grid.innerHTML += `<li>${el}</li>\n`);

const registerButton = document.getElementById("register");

registerButton.addEventListener("click", () => {
  const loggedEmail = user.getLoggedEmail();

  if(!loggedEmail) window.location = "/page/login/";

  const userData = user.get(loggedEmail);
  
  const courseData = {
    id: courseId,
    attempts: 3,
    watched: [],
    finished: false,
    score: null,
  }

  if(!userData.courses.some(c => c.id === courseId)) userData.courses.push(courseData);
  user.set(userData);

  window.location = `/page/home/`;
});