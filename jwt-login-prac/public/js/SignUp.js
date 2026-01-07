document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const result = document.querySelector(".response");

  result.innerText = "";
  result.classList.remove("success", "warning");

  if (!username || !password || !confirmPassword) {
    result.innerText = "All fields are required.";
    result.classList.add("warning");
    return;
  }

  if (password !== confirmPassword) {
    result.innerText = "Passwords do not match.";
    result.classList.add("warning");
    return;
  }

  const data = { username, password, confirmPassword };

  try {
    let response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      result.innerText = await response.text();
      result.classList.add("success");
    } else {
      result.innerText = await response.text();
      result.classList.add("warning");
    }
  } catch (error) {
    console.log("Error: ", error);
    alert("Something went wrong!");
  }
});
