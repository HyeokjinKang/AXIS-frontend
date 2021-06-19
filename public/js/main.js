const video = document.getElementById("webcam");

let menu = [];
let msg = new SpeechSynthesisUtterance();
let voices;
let interval;
let blindMode = false;

document.addEventListener("DOMContentLoaded", (event) => {
  speechSynthesis.cancel();
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
              let storeClass = document.getElementsByClassName("storeName");
              for (e of storeClass) {
                e.innerText = data.data[0].name;
              }
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
  interval = setInterval(() => {
    speech(orderHere);
  }, 30000);
};

const speech = (text) => {
  speechSynthesis.cancel();
  voices = window.speechSynthesis.getVoices();
  if (lang == "en") msg.voice = voices[1];
  if (lang == "ko") msg.voice = voices[11];
  if (lang == "cn") msg.voice = voices[16];
  if (lang == "jp") msg.voice = voices[10];
  msg.text = text;
  speechSynthesis.speak(msg);
};

const start = () => {
  waitContainer.classList.add("fadeOut");
  setTimeout(() => {
    waitContainer.style.display = "none";
  }, 1000);
  clearInterval(interval);
  speech(tempCheck);
};

const tempUpdate = (temp) => {
  temperature.innerText = `${temp}°C`;
  webcamOverlay.classList.remove("fever");
  temperature.classList.remove("fever");
  webcamOverlay.classList.remove("normal");
  temperature.classList.remove("normal");
  if (temp > 37) {
    webcamOverlay.classList.add("fever");
    temperature.classList.add("fever");
    alertText.innerText = feverWarning;
    alertSubText.innerText = feverWarningSub;
    speech(`${feverWarning}. ${feverWarningSub}`);
    setTimeout(() => {
      location.reload();
    }, 3000);
  } else {
    webcamOverlay.classList.add("normal");
    temperature.classList.add("normal");
    alertText.innerText = feverNormal;
    speech(feverNormal);
    setTimeout(() => {
      qrcode();
    }, 3000);
  }
  webcamOverlay.classList.add("display");
};

const noMask = () => {
  speech(noMaskWarnSub);
  temperature.innerText = noMaskWarn;
  alertText.innerText = noMaskWarnSub;
  webcamOverlay.classList.add("fever");
  temperature.classList.add("fever");
  webcamOverlay.classList.remove("normal");
  temperature.classList.remove("normal");
  webcamOverlay.classList.add("display");
};

const constraints = {
  audio: false,
  video: true,
};

const handleSuccess = (stream) => {
  window.stream = stream;
  video.srcObject = stream;
};

const handleError = (error) => {
  console.error(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
  alert("에러가 발생했습니다.");
};

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);
