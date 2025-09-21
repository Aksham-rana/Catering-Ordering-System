// order.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// --- Firebase config (replace with your project config) ---
const firebaseConfig = {
  apiKey: "AIzaSyCbIEs7pMdVDI3hEZC2o-SbuqBlYBX-89s",
  authDomain: "cateringsystem-9ec1b.firebaseapp.com",
  projectId: "cateringsystem-9ec1b",
  storageBucket: "cateringsystem-9ec1b.firebasestorage.app",
  messagingSenderId: "776751308002",
  appId: "1:776751308002:web:780402b20a5fd7e89092bb",
  measurementId: "G-R9FNV4PP9N"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let cartItems = [];
let userId = null;

const cartTableBody = document.querySelector(".cart-table tbody");
const totalElement = document.querySelector(".cart-summary h3");
const placeOrderBtn = document.querySelector(".place-order");

// --- Listen for logged-in user ---
onAuthStateChanged(auth, async user => {
  if (user) {
    userId = user.uid;

    const cartCollection = collection(db, "carts", userId, "items");

    // Real-time listener for cart items
    onSnapshot(cartCollection, snapshot => {
      cartItems = [];
      snapshot.forEach(doc => cartItems.push({ id: doc.id, ...doc.data() }));
      renderCart();
    });

  } else {
    // Slight delay ensures Firebase finishes loading
    setTimeout(() => {
      alert("Please login to view your cart");
      window.location.href = "login.html";
    }, 100);
  }
});

// --- Render cart items ---
function renderCart() {
  cartTableBody.innerHTML = "";
  let total = 0;

  cartItems.forEach(item => {
    const row = document.createElement("tr");
    const subtotal = item.price * item.quantity;
    total += subtotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td><input type="number" value="${item.quantity}" min="1"></td>
      <td class="item-subtotal">₹${subtotal}</td>
      <td><button>Remove</button></td>
    `;

    const qtyInput = row.querySelector("input");
    const subtotalCell = row.querySelector(".item-subtotal");

    // Quantity change: update Firestore and UI immediately
    qtyInput.addEventListener("input", async e => {
      let newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      e.target.value = newQty;

      const itemRef = doc(db, "carts", userId, "items", item.id);
      await updateDoc(itemRef, { quantity: newQty });

      // Update subtotal and total
      subtotalCell.innerText = `₹${item.price * newQty}`;
      updateTotal();
    });

    // Remove item
    const removeBtn = row.querySelector("button");
    removeBtn.addEventListener("click", async () => {
      const itemRef = doc(db, "carts", userId, "items", item.id);
      await deleteDoc(itemRef);
    });

    cartTableBody.appendChild(row);
  });

  updateTotal();
}

// --- Update total dynamically ---
function updateTotal() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalElement.innerText = `Total: ₹${total}`;
}

// --- Place order ---
placeOrderBtn.addEventListener("click", async () => {
  if (!userId || cartItems.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId,
      products: cartItems,
      total: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: "pending",
      createdAt: serverTimestamp()
    });

    // Clear cart after order
    for (const item of cartItems) {
      const itemRef = doc(db, "carts", userId, "items", item.id);
      await deleteDoc(itemRef);
    }

    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("Error placing order: " + err.message);
  }
});
