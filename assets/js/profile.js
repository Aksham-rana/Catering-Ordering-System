document.addEventListener("DOMContentLoaded", () => {

  const profileForm = document.querySelector("form");
  if (!profileForm) return;

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = profileForm.querySelector('input[type="text"]').value.trim();
    const email = profileForm.querySelector('input[type="email"]').value.trim();
    const password = profileForm.querySelector('input[type="password"]').value.trim();

    if (!name || !email) {
      alert("Please fill in all required fields");
      return;
    }

    alert(`Profile updated successfully!\nName: ${name}\nEmail: ${email}`);
    profileForm.reset();
  });

});
