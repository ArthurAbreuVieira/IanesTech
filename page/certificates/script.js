import user from "../../public/js/user.js";
import course from "../../public/js/course.js";

const logoffButton = document.querySelector("[data-js=logoff]");
logoffButton.addEventListener("click", () => user.logoff());

if (!user.checkUserLogin()) window.location = "/";
const userData = user.get(user.getLoggedEmail());

document.querySelector("[data-js=name]").innerText = `Olá, ${userData.name.split(" ")[0]}`;

const table = document.getElementsByTagName("tbody")[0];

userData.courses.forEach(c => {
  const courseData = course.find(c.id);

  if (c.finished)
    table.innerHTML += `
      <tr>
        <td>${courseData.title}</td>
        <td>${c.conclusion}</td>
        <td><a href="/page/certificate/index.html?course=${c.id}" target="_blank" class="btn blue-gradient">Ver Certificado</a></td>
      </tr>
    `;
});

if (!table.innerHTML)
  table.innerHTML += `
    <tr>
      <td colspan="2" align="left" style="padding-left:10px">Você ainda não tem nenhum certificado</td>
      <td><a href="/page/home/index.html" class="btn blue-gradient">Meus cursos</a></td>
    </tr>
  `;

