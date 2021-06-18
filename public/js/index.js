const idReg = /[a-z0-9_-]/;
const pwReg = /[a-zA-Z0-9!_-]/;

const submit = () => {
  let error = 0;
  if (!idReg.test(document.getElementById("id").value)) {
    document.getElementById("id").classList.add("error");
    window.requestAnimationFrame(() => {
      document.getElementById("id").value = "";
      document.getElementById("id").placeholder = "ID형식 오류";
      document.getElementById("id").classList.remove("error");
    });
    error++;
  }
  if (!pwReg.test(document.getElementById("pw").value)) {
    document.getElementById("pw").classList.add("error");
    window.requestAnimationFrame(() => {
      document.getElementById("pw").value = "";
      document.getElementById("pw").placeholder = "PW형식 오류";
      document.getElementById("pw").classList.remove("error");
    });
    error++;
  }
  if (error) {
    return;
  }
  fetch(`${api}/auth/login`, {
    method: "POST",
    credentials: "include",
    body: new URLSearchParams({
      username: document.getElementById("id").value,
      password: document.getElementById("pw").value,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result == "success") {
        window.location.href = `${front}/main`;
      } else {
        document.getElementById("id").classList.add("error");
        window.requestAnimationFrame(() => {
          document.getElementById("id").value = "";
          document.getElementById("id").placeholder = "ID 오류";
          document.getElementById("id").classList.remove("error");
        });
        document.getElementById("pw").classList.add("error");
        window.requestAnimationFrame(() => {
          document.getElementById("pw").value = "";
          document.getElementById("pw").placeholder = "PW 오류";
          document.getElementById("pw").classList.remove("error");
        });
      }
    });
};
