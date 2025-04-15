import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

const signupForm = document.querySelector(".signup");
const loginForm = document.querySelector(".login");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const [email, pass, conf] = document.querySelectorAll(".signup__input");

    if (pass.value !== conf.value) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email.value, pass.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        window.location.href = "../StocksPage/Stocks.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorCode, errorMessage);
        alert(errorMessage);
      });
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const [email, pass] = document.querySelectorAll(".login__input");
    signInWithEmailAndPassword(auth, email.value, pass.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "../StocksPage/Stocks.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
        alert(errorMessage);
      });
  });
}
