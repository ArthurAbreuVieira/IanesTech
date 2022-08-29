import ___courses___ from "./___courses___.js";
import ___tests___ from "./___tests___.js";

const course = {
  ___setCourses___() {
    localStorage.setItem("courses", JSON.stringify(___courses___));
    localStorage.setItem("tests", JSON.stringify(___tests___));
  },
  find(id) {
    const courses = JSON.parse(localStorage.getItem("courses")) ?? [];
    const foundCourse = courses.filter(c => c.id === id);
    if(foundCourse.length === 0) return false;
    
    return foundCourse[0];
  },
  getTest(courseId) {
    const tests = JSON.parse(localStorage.getItem("tests")) ?? [];
    const foundTest = tests.filter(t => t.course === courseId);
    if(foundTest.length === 0) return false;
    
    return foundTest[0];
  },
}

export default course;