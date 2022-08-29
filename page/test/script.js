import course from "../../public/js/course.js";
import user from "../../public/js/user.js"

const query = new URLSearchParams(location.search);
const courseId = parseInt(query.get("course"));
const courseData = course.find(courseId);
if (!courseData) window.location = "/";

if(!user.checkUserLogin()) window.location = "/";
const userData = user.get(user.getLoggedEmail());
const userCourse = userData.courses.filter(c => c.id === courseId)[0];

if(userCourse.attempts <= 0) {
  userCourse.attempts = 3;
  userCourse.watched = [];
  userData.courses = [...userData.courses.filter(c => c.id !== userCourse.id), userCourse];
  user.set(userData);
  window.location = `/page/course/index.html?id=${courseId}`;
} else {
  userCourse.attempts -= 1;
  userData.courses = [...userData.courses.filter(c => c.id !== userCourse.id), userCourse];
  user.set(userData);
}


const logoffButton = document.querySelector("[data-js=logoff]");
logoffButton.addEventListener("click", () => user.logoff());

const test = course.getTest(courseId);
const answers = Array(test.questions.length).fill(null);
let currentQuestion = -1;

const title = document.querySelector("[data-js=title]");
const attempt = document.querySelector("[data-js=attempt]");
const card = document.querySelector("[data-js=card]");

title.innerText = `Curso: ${courseData.title}`;
attempt.innerText = 3 - userCourse.attempts;
card.style.backgroundImage = `url(../../public/img/${courseData.cardImage})`;


const navButtons = document.querySelectorAll("[data-js=nav-button]");

navButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    if (btn.dataset.nav === "prev" && currentQuestion - 1 < 0) return false;
    if (btn.dataset.nav === "next" && currentQuestion + 1 >= test.questions.length) return false;


    if (btn.dataset.nav === "prev") {
      setQuestion("prev");
      navButtons[1].style.display = "block";
      navButtons[2].style.display = "none";
      if (currentQuestion - 1 < 0) navButtons[0].style.display = "none";
    }

    if (btn.dataset.nav === "next") {
      setQuestion("next");
      if (currentQuestion >= test.questions.length - 1) {
        navButtons[1].style.display = "none";
        navButtons[2].style.display = "block";
      }
      if (currentQuestion > 0) navButtons[0].style.display = "block";
    }

    if (btn.dataset.nav === "finish") {
      finish();
    }
  });
});

function setQuestion(option) {
  currentQuestion += option === "prev" ? -1 : 1;

  const questionsContainer = document.getElementById("questions-container");

  const _class = [
    answers[currentQuestion] === 0 ? "selected" : "",
    answers[currentQuestion] === 1 ? "selected" : "",
    answers[currentQuestion] === 2 ? "selected" : "",
    answers[currentQuestion] === 3 ? "selected" : "",
  ]

  questionsContainer.innerHTML = `
    <p>Questão ${currentQuestion + 1}</p>
    <h2>${test.questions[currentQuestion].title}</h2>

    <button class="option">${test.questions[currentQuestion].options[0]}</button>
    <button class="option">${test.questions[currentQuestion].options[1]}</button>
    <button class="option">${test.questions[currentQuestion].options[2]}</button>
    <button class="option">${test.questions[currentQuestion].options[3]}</button>
  `;

  const buttonOptions = document.querySelectorAll(".option");
  buttonOptions.forEach((btn, index) => {

    if (_class[index]) btn.classList.add(_class[index]);

    btn.addEventListener("click", e => {
      buttonOptions.forEach(b => b.classList.remove("selected"));
      btn.classList.toggle("selected");
      answers[currentQuestion] = index;
    });
  });
}

function finish() {
  if (answers.some(a => a === null)) {
    alert("Responda todas as questões!");
    return false;
  }

  let correct = 0;

  test.questions.forEach((question, index) => {
    if (question.answer === answers[index]) correct++;
  });

  const score = Math.ceil((correct * 100) / test.questions.length);

  const questionsContainer = document.getElementById("block");

  if (score >= 70) {
    const date = new Date();

    userCourse.finished = true;
    userCourse.score = score;
    userCourse.conclusion = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    userData.courses = [...userData.courses.filter(c => c.id !== userCourse.id), userCourse];
    user.set(userData);

    questionsContainer.innerHTML = `
      <p class="title-3">Parabéns! você foi aprovado!</p>
      <img src="../../public/img/pass.png" width="40%"/>
      <p class="dark-text">Você acertou <span class="green-text">${score}%</span> da avaliação</p>
      <a class="btn btn-large blue-gradient" href="/page/certificate/index.html?course=${courseId}">Ver meu certificado</a>
    `;
  } else {
    if(userCourse.attempts <= 0) {
      userCourse.attempts = 3;
      userCourse.watched = [];
      userData.courses = [...userData.courses.filter(c => c.id !== userCourse.id), userCourse];
      user.set(userData);
    }

    questionsContainer.innerHTML = `
      <p class="title-3">Poxa, você foi reprovado.</p>
      <img src="../../public/img/fail2.png" />
      <p class="dark-text">Você acertou <span class="green-text">${score}%</span> da avaliação</p>
      <p class="dark-text">É necessário acertar pelo menos <span style="color: hotpink;font-weight:bold">70%</span> do total para ser aprovado</p>
      <a class="btn btn-large blue-gradient" href="/page/course/index.html?id=${courseId}">Voltar ao curso</a>
    `;
  }

}

setQuestion("next");