const api_url = "http://localhost:5678/api/";

const form = {
    email: document.querySelector("#login-email"),
    password: document.querySelector("#login-password"),
    submit: document.querySelector("#login-btn-submit"),
  };
  
  let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    const login = api_url + "users/login";
  
    fetch(login, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert("Erreur dans l’identifiant ou le mot de passe"); /*displays error message*/
        } else {
            localStorage.setItem("auth", 1);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("token", data.token);
            window.location.href="/";
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });