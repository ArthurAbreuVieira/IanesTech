import course from "../../public/js/course.js";
import user from "../../public/js/user.js"

const query = new URLSearchParams(location.search);
const courseId = parseInt(query.get("course"));
const courseData = course.find(courseId);

if (!courseData) window.location = "/";

if(!user.checkUserLogin()) window.location = "/";
const userData = user.get(user.getLoggedEmail());
const userCourse = userData.courses.filter(c => c.id === courseId)[0];

if(!userCourse || !userCourse.finished) window.location = "/page/certificates/";


const certificate = document.getElementById("certificate");
const ctx = certificate.getContext("2d");

certificate.width = "1080";
certificate.height = "720";

const moldure = new Image();
const medal = new Image();
const signature = new Image();
moldure.src = "../../public/img/moldure.png";
medal.src = "../../public/img/medal.png";
signature.src = "../../public/img/signature.png";
moldure.onload = drawCertificate;
medal.onload = drawCertificate;
signature.onload = drawCertificate;

function drawCertificate() {
  const certBg = ctx.createLinearGradient(0,0,certificate.height,certificate.width);
  certBg.addColorStop(0, "#008cff");
  certBg.addColorStop(1, "#0059ff");

  ctx.fillStyle = certBg;
  ctx.fillRect(0,0,certificate.width,certificate.height);

  ctx.fillStyle = "#fff3";
  ctx.fillRect(0,0,certificate.width,certificate.height);

  ctx.fillStyle = "darkblue";
  ctx.fillRect(0,0,260,certificate.height);

  ctx.drawImage(moldure, certificate.width-460, certificate.height-440, 500, 500);
  ctx.drawImage(medal, 85, certificate.height-150, 100, 100);

  ctx.font = "bold 30px Arial"
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Ianes", 95, 70);
  ctx.fillStyle = "#00e88f";
  ctx.fillText("Tech", 95 + 75, 70);


  ctx.textAlign = "left";

  ctx.fillStyle = "darkblue";
  ctx.font = "900 40px Arial";
  ctx.fillText("CERTIFICADO DE CONCLUSÃO", 300, 75);

  // ctx.shadowColor = "black";
  // ctx.shadowBlur = 5;
  ctx.fillStyle = "#fff";
  ctx.font = "normal 25px Arial";
  ctx.fillText("Certificamos que", 300, 200);

  ctx.fillStyle = "#ff9";
  ctx.font = "italic 50px Times";
  ctx.fillText(userData.name, 300, 270);

  ctx.fillStyle = "#fff";
  ctx.font = "normal 20px Arial";
  ctx.fillText(`Concluiu o curso de ${courseData.title} em ${userCourse.conclusion}`, 300, 330);

  ctx.fillStyle = "#fff";
  ctx.font = "normal 20px Arial";
  ctx.fillText(`e obteve resultado de ${userCourse.score}% na avaliação final.`, 300, 360);

  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.moveTo(300, 630);
  ctx.lineTo(600, 630);
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.font = "bold 15px Arial";
  ctx.fillText("Arthur Abreu Vieira Mendes", 345, 650);

  ctx.font = "15px Arial";
  ctx.fillText("Presidente", 405, 670);

  ctx.drawImage(signature, 330, 557, 190, 90);


  const links = document.querySelectorAll("[data-js=download]");
  links.forEach(link => link.href = certificate.toDataURL());
}






