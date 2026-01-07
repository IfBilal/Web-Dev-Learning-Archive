let username = document.querySelector("input");
let search = document.querySelector("button");
let url = "https://api.github.com/users/";
let profile = document.querySelector(".profile-card");
search.addEventListener("click", () => {
  let user = username.value;
  if (user != "") {
    fetchData(user);
  }
});

function showUserProfile(data) {
  profile.style.display = "initial";
  profile.innerHTML = `
      <img src="${data.avatar_url}" width="100" />
      <h2>${data.name}</h2>
      <p>${data.bio || "No bio provided"}</p>
      <p>Public Repos: ${data.public_repos}</p>
      <p>Followers: ${data.followers}</p>
      <p>Following: ${data.following}</p>
      <a href="${data.html_url}" target="_blank">Visit Profile</a>
    `;
}

async function fetchData(user) {
  let response = await fetch(`${url}${user}`);
  let data = await response.json();
  console.log(data);
  showUserProfile(data);
}
