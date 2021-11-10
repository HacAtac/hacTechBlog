//Front in javascript logic for login page
// async function that takes event as parameter and prevent default behaviour of the event and await for response from the server
// then if the response is ok then redirect to the home page else display the error message on the console
async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  //condition to check username password an email and await for response
  if (username && email && password) {
    const response = await fetch("/api/users", {
      method: "post",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      console.log("success");
      alert("Signup Successful");
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector("#sign-up")
  .addEventListener("sumbit", signupFormHandler);

// async function for loginFormHandler that takes event as parameter and prevent default behaviour of the event and await for response from the server
// then if the response is ok then redirect to the home page else display the error message on the console
async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (email && password) {
    const response = await fetch("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
  }
}
document.querySelector("#log-in").addEventListener("submit", loginFormHandler);
