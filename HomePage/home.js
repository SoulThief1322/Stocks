import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0qMNvQTAF1WQr4FKgb88ZMo6YFaLIYNE",
  authDomain: "stockapp-553c7.firebaseapp.com",
  databaseURL: "https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stockapp-553c7",
  storageBucket: "stockapp-553c7.firebasestorage.app",
  messagingSenderId: "490109446228",
  appId: "1:490109446228:web:3745962918312e0bb7e5c1",
  measurementId: "G-1HQ2PH222T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const cta = document.querySelector(".cta");

const scrollButton = document.querySelector(".scroll-button");
const logoutButton = document.querySelector("#logout");
const navbar = document.querySelector("#navbar-container");
document.addEventListener("DOMContentLoaded", function () {
  

  if (localStorage.getItem("user") !== null) {
    navbar.classList.remove("notVisible");
    cta.addEventListener("click", () => {
      window.location.href = "../StocksPage/stocks.html";
    });
    
  } else {
    navbar.classList.add("notVisible");
    cta.addEventListener("click", () => {
      window.location.href = "../SignPage/SignUp.html";
    });
  }
});


window.addEventListener("scroll", () => {
  window.pageYOffset > 100
    ? scrollButton.classList.add("show-btn")
    : scrollButton.classList.remove("show-btn");
});

scrollButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "../HomePage/home.html";
});
