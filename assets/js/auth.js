// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCbIEs7pMdVDI3hEZC2o-SbuqBlYBX-89s",
  authDomain: "cateringsystem-9ec1b.firebaseapp.com",
  projectId: "cateringsystem-9ec1b",
  storageBucket: "cateringsystem-9ec1b.firebasestorage.app",
  messagingSenderId: "776751308002",
  appId: "1:776751308002:web:780402b20a5fd7e89092bb",
  measurementId: "G-R9FNV4PP9N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------- Register User ----------------
async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullName: name,
      email: email,
      createdAt: serverTimestamp()
    });

    alert(`Registration successful for ${name}`);
    window.location.href = "login.html"; // redirect to login
  } catch (error) {
    alert(error.message);
  }
}

// ---------------- Login User ----------------
async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert(`Login successful for ${email}`);
    window.location.href = "index.html"; // redirect to home
  } catch (error) {
    alert(error.message);
  }
}

// ---------------- Handle Forms ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Register Form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = registerForm.querySelector('input[type="text"]').value.trim();
      const email = registerForm.querySelector('input[type="email"]').value.trim();
      const password = registerForm.querySelectorAll('input[type="password"]')[0].value.trim();
      const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value.trim();

      if (!name || !email || !password || !confirmPassword) {
        return alert("Please fill all fields");
      }

      if (password !== confirmPassword) {
        return alert("Passwords do not match");
      }

      registerUser(name, email, password);
      registerForm.reset();
    });
  }

  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value.trim();

      if (!email || !password) return alert("Please fill all fields");

      loginUser(email, password);
      loginForm.reset();
    });
  }
});
