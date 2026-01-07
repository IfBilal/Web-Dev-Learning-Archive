document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const result = document.querySelector(".response");

  result.innerText = "";
  result.classList.remove("success", "warning");

  if (!username || !password) {
    result.innerText = "All fields are required.";
    result.classList.add("warning");
    return;
  }
  if (password.length < 5) {
    result.innerText = "Password must be at least 5 characters long..";
    result.classList.add("warning");
    return;
  }

  const data = { username, password };

  try {
    let response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
        window.open("/dashboard", "_blank");
    } else {
      result.innerText = await response.text();
      result.classList.add("warning");
    }
  } catch (error) {
    console.log("Error: ", error);
    alert("Something went wrong!");
  }
});
