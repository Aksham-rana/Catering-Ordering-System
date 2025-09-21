// my-orders.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// --- Firebase config (same as your project) ---
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
const db = getFirestore(app);
const auth = getAuth(app);

const ordersTableBody = document.querySelector(".orders-table tbody");

// Listen for logged-in user
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Please login to view your orders");
    window.location.href = "login.html";
    return;
  }

  const userId = user.uid;
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));

  // Real-time listener for orders
  onSnapshot(q, snapshot => {
    ordersTableBody.innerHTML = ""; // clear table first

    if (snapshot.empty) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5" style="text-align:center;">No orders found</td>`;
      ordersTableBody.appendChild(row);
      return;
    }

    snapshot.forEach(orderDoc => {
      const order = orderDoc.data();
      const orderId = orderDoc.id;

      order.products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${orderId}</td>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>₹${product.price}</td>
          <td>${order.status}</td>
        `;
        ordersTableBody.appendChild(row);
      });
    });
  });
});
