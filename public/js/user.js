// import db from "./db.js";

const user = {
  create(data) {
    const lastIndex = parseInt(localStorage.getItem("lastDBindex" ?? 0)) + 1;
    const users = JSON.parse(localStorage.getItem("users")) ?? [];

    if(!users) return false;
    
    data.id = lastIndex;
    data.courses = [];
    
    if(users.some(u => u.email === data.email)) return false;

    localStorage.setItem("lastDBindex", lastIndex)

    localStorage.setItem("users", JSON.stringify([...users, data]));
    return true;
  },
  login(data) {
    const _user = this.get(data.email);

    if(!_user || _user.email !== data.email || _user.password !== data.password) return false;


    const loggedData = {
      id: data.id,
      email: data.email
    }
    localStorage.setItem("loggedUser", JSON.stringify(loggedData));
    return true;
  },
  logoff() {
    const loggedData = {
      id: null,
      email: null
    }
    localStorage.setItem("loggedUser", JSON.stringify(loggedData));
    window.location = "/";
    return true;
  },
  checkUserLogin() {
    const userData = this.get(this.getLoggedEmail());
    if(!userData) return false;
    
    return true;
  },
  get(email) {
    const users = JSON.parse(localStorage.getItem("users")) ?? [];
    if(users.length === 0) return false;
    const foundUser = users.filter(u => u.email === email);
    if(foundUser.length === 0) return false;

    return foundUser[0];
  },
  set(data) {
    const allUsers = JSON.parse(localStorage.getItem("users")) ?? [];

    const users = allUsers.filter(u => u.id !== data.id);

    const newData = [...users, data];
    localStorage.setItem("users", JSON.stringify(newData));
    return true;
  },
  getLoggedEmail() {
    const userData = JSON.parse(localStorage.getItem("loggedUser"));

    if(userData) return userData.email;
    else return false;
  }
}

export default user;