import user from "../../public/js/user.js";
import course from "../../public/js/course.js";

if (!user.checkUserLogin()) window.location = "/";

const logoffButton = document.querySelector("[data-js=logoff]");
logoffButton.addEventListener("click", () => user.logoff());

const courseContainer = document.querySelector('.user-courses-container > div');
const userCourses = user.get(user.getLoggedEmail()).courses;

if (userCourses.length > 0) {
  courseContainer.innerHTML = "";
  userCourses.forEach(c => {
    const courseData = course.find(c.id);
    const progress = ((c.watched.length * 100) / courseData.grid.length).toFixed(0);

    if (!c.finished) {
      courseContainer.innerHTML += `
        <div class="current-course">
          <a href="/page/course/?id=${courseData.id}" class="flex-col-around">
            <h2>${courseData.title}</h2>
            <p>Progresso • ${progress}%</p>
          </a>
        </div>
      `;

      let card = document.querySelectorAll(".current-course");
      card = card[card.length - 1];
      card.style.backgroundImage = `url(../../public/img/${courseData.cardImage})`;
    }
  });
}

if(!courseContainer.innerHTML) {
  courseContainer.innerHTML = `
    <div class="warning">
      <p>Você ainda não está matriculado em nenhum curso</p>
    </div>
  `;

  courseContainer.insertAdjacentHTML("afterend", '<a href="/page/certificates/" class="pink-box-text">Meus Certificados</a>');
}