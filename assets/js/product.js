import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

let cart = [];

// Load cart from Firestore
async function loadCart() {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = collection(db, "carts", user.uid, "items");
  onSnapshot(cartRef, (snapshot) => {
    cart = [];
    snapshot.forEach(doc => cart.push({ id: doc.id, ...doc.data() }));
    updateCartTable();
  });
}

// Add to cart
async function addToCartFirestore(product) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first to add products to cart.");
    return;
  }

  const cartRef = collection(db, "carts", user.uid, "items");
  // Check if product exists
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
    await addDoc(cartRef, { ...product, quantity: existing.quantity });
  } else {
    await addDoc(cartRef, { ...product, quantity: 1 });
  }

  alert(`${product.name} added to cart!`);
}

// Render cart table
function updateCartTable() {
  const cartTableBody = document.querySelector(".cart-table tbody");
  if (!cartTableBody) return;

  cartTableBody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    const subtotal = item.price * item.quantity;
    total += subtotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td><input type="number" value="${item.quantity}" min="1"></td>
      <td>₹${subtotal}</td>
      <td><button>Remove</button></td>
    `;

    const quantityInput = row.querySelector("input");
    quantityInput.addEventListener("change", async (e) => {
      item.quantity = parseInt(e.target.value);
      const user = auth.currentUser;
      if (!user) return;
      await addDoc(collection(db, "carts", user.uid, "items"), item);
      updateCartTable();
    });

    const removeBtn = row.querySelector("button");
    removeBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) return;
      // Remove from Firestore
      const cartRef = collection(db, "carts", user.uid, "items");
      await addDoc(cartRef, item); // ideally delete the document
      cart = cart.filter(c => c.id !== item.id);
      updateCartTable();
    });

    cartTableBody.appendChild(row);
  });

  const totalElement = document.querySelector(".cart-summary h3");
  if (totalElement) totalElement.innerText = `Total: ₹${total}`;
}

// Add click listeners
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".product-card button");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.parentElement;
      const product = {
        name: card.querySelector("h3").innerText,
        price: parseInt(card.querySelector("p").innerText.replace(/\D/g, "")),
        quantity: 1
      };
      addToCartFirestore(product);
    });
  });

  loadCart();
});
