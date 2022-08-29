import course from "../../public/js/course.js";
import user from "../../public/js/user.js"

const query = new URLSearchParams(location.search);
const courseId = parseInt(query.get("id"));
const courseData = course.find(courseId);

if(!user.checkUserLogin()) window.location = "/";

const logoffButton = document.querySelector("[data-js=logoff]");
logoffButton.addEventListener("click", () => user.logoff());

const userData = user.get(user.getLoggedEmail());
const userCourse = userData.courses.filter(c => c.id === courseId)[0];

if (!courseData) window.location = "/";

const title = document.querySelectorAll("[data-js=title]");
const thumbnail = document.querySelector("[data-js=thumbnail]");
const grid = document.querySelector("[data-js=grid]");
const table = document.querySelector(".class-table");
table.innerHTML = "";

title.forEach(el => el.innerText = `Curso: ${courseData.title}`);
thumbnail.src = `../../public/img/${courseData.thumbnail}`;
grid.innerHTML = "";

courseData.grid.forEach((el, index) => {
  grid.innerHTML += `<li>${el}</li>\n`;

  table.innerHTML += `
    <tr class="flex-between">
      <td class="class-title-td">
        <h3 class="title-2">${el}</h3>
      </td>
      <td class="flex-end class-actions-td">
        ${userCourse.watched.includes(index) ? '<span class="green-box-text">Assistido</span>' : ""}
        <button class="active-square-nav-button square-nav-button blue-gradient" data-js="watch-button">Assistir aula</button>
      </td>
    </tr>
  `;
});

const tabs = document.querySelectorAll(".tab");
const tabSection = document.querySelectorAll("[data-js=tab-section]");

tabs.forEach(tab => {
  tab.addEventListener("click", e => {
    tabs.forEach(t => t.classList.remove("active-tab"))
    tab.classList.toggle("active-tab");

    const selectedTab = e.target.dataset.tab;

    tabSection.forEach(ts => ts.style.display = "none");

    if (selectedTab === "classes") document.getElementById("classes").style.display = "flex";
    else if (selectedTab === "test") {
      const testContainer = document.getElementById("test");
      testContainer.style.display = "flex";
      
      
      if (userCourse.watched.length === courseData.grid.length) {
        testContainer.innerHTML = "";
        testContainer.innerHTML = `
          <div class="test-details-container flex-center">
            <img src="../../public/img/test.png">
            <div class="flex-col-start">
              <p class="title-2">Você já pode realizar o teste de aptidão do curso</p>
              <p class="orange-box-text">Tentativas restantes: ${userCourse.attempts}</p>
              <p class="pink-box-text">LEIA COM ATENÇÃO</p>

              <ul>
                <li>Você terá 3 tentativas para realizar o teste</li>
                <li>Se for reprovado nas 3 tentativas será necessário assistir todas as aulas novamente</li>
                <li>Para ser aprovado é necessário acertar pelo menos 70% das questões</li>
                <li>Ao ser aprovado o curso será finalizado e um certificado será emitido</li>
              </ul>

              <a class="square-nav-button blue-green-gradient" href="/page/test/index.html?course=${courseId}">Iniciar teste</a>
            </div>
          </div>
        `;
      }

    } else document.getElementById("details").style.display = "flex";
  });
})


const watchButtons = document.querySelectorAll("[data-js=watch-button]");
watchButtons.forEach((btn, index) => {
  btn.addEventListener("click", e => {
    const videoContainerStr = `
    <div id="video">
      <button class="close-button" title="FECHAR"></button>
      <img src="../../public/img/loading.gif" class="loading"/>
      <iframe width="800" height="400" src="${courseData.video[index]}" title="Video aula" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`;
    const videoContainerEl = new DOMParser().parseFromString(videoContainerStr, "text/html").firstChild.children[1].firstChild;

    document.body.appendChild(videoContainerEl);

    const closeBtn = document.querySelector(".close-button");
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(videoContainerEl);
    });
    
    if(!userCourse.watched.includes(index)) {
      userCourse.watched.push(index);
      userData.courses = [...userData.courses.filter(c => c.id !== userCourse.id), userCourse];
      user.set(userData);
      btn.insertAdjacentHTML("beforebegin", `<span class="green-box-text">Assistido</span>`);
    }
  });
});

const showClasses = document.querySelector("[data-js=show-classes]");
showClasses.addEventListener("click", () => {
  tabSection.forEach(ts => ts.style.display = "none");
  tabs.forEach(t => t.classList.remove("active-tab"))
  tabs[0].classList.toggle("active-tab");
  document.getElementById("classes").style.display = "flex";
});