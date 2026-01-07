document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/logout", { method: "POST" });
    if (res.ok) {
      window.location.href = "/login";
    } else {
      alert("Logout failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});
