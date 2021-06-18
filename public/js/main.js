let menu = [];

document.addEventListener("DOMContentLoaded", (event) => {
  fetch(`${api}/auth/user`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result == "success") {
        fetch(`${api}/auth/store`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.result == "success") {
              fetch(`${api}/menu`, {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                  store: data.data[0].name,
                }),
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.result == "success") {
                    menu = data.data;
                    doneLoading();
                  } else {
                    alert(
                      "등록된 메뉴가 없습니다. 메뉴 등록 후 재시도해주세요."
                    );
                    window.location.href = front;
                  }
                });
            } else {
              alert("등록된 상점이 없습니다. 상점 등록 후 재시도해주세요.");
              window.location.href = front;
            }
          });
      } else {
        window.location.href = front;
      }
    });
});

const doneLoading = () => {
  setTimeout(() => {
    document.getElementById("loadingContainer").classList.add("fadeOut");
    setTimeout(() => {
      document.getElementById("loadingContainer").style.display = "none";
    }, 1000);
  }, 1000);
};

const start = () => {
  document.getElementById("waitContainer").classList.add("fadeOut");
  setTimeout(() => {
    document.getElementById("waitContainer").style.display = "none";
  }, 1000);
};
