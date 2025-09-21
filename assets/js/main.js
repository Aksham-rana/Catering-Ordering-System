document.addEventListener("DOMContentLoaded", () => {
  
  const navLinks = document.querySelectorAll("nav ul li a");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const target = e.target.getAttribute("href");
      if (!target) return;
    });
  });

  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.addEventListener("mouseover", () => {
      btn.style.opacity = "0.8";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.opacity = "1";
    });
  });

  const productButtons = document.querySelectorAll(".product-card button");

  productButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const productName = btn.parentElement.querySelector("h3").innerText;
      alert(`${productName} added to cart`);
    });
  });

});
