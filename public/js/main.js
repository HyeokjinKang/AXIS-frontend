const video = document.getElementById("webcam");

let menu = [];
let menuJson = {};
let category = [];
let categorySelection = 0;
let selection = 0;
let cart = [];
let amount = 0;
let place = "";
let method = "";
let storeName = "";
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
              storeName = data.data[0].name;
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

const qrcode = () => {
  speech(codeCheck);
  if (blindMode) {
    setTimeout(() => {
      speech(`${mobile3} 1. ${mobile1} 2. ${mobile2}`);
    }, 5000);
  }
  interactionsInformation.innerText = qrcodeExplain;
  document
    .getElementsByClassName("additButtonContainer")[1]
    .classList.remove("displayNone");
  webcamOverlay.classList.remove("display");
  document.getElementsByClassName("arrow")[0].classList.remove("progressNow");
  document.getElementsByClassName("arrow")[1].classList.add("progressNow");
  document.getElementsByClassName("rightArrow")[0].src =
    "/images/right-arrow_active.png";
  document.getElementsByClassName("progressIcon")[1].src =
    "/images/code_active.png";
  document.getElementsByClassName("progressText")[0].innerText = complete;
  document.getElementsByClassName("progressText")[1].innerText = inProgress;
  document
    .getElementsByClassName("progressText")[1]
    .classList.add("progressNow");
  document
    .getElementsByClassName("progressExplainText")[1]
    .classList.add("progressNow");
};

const mobileCheck = () => {
  speech(`${mobile3} 1. ${mobile1} 2. ${mobile2}`);
  nfcContainer.classList.add("display");
};

const mobileCheckCancel = () => {
  nfcContainer.classList.remove("display");
};

const howtoCheck = () => {
  speech(`${howto3} 1. ${howto1} 2. ${howto2}`);
  howtoContainer.classList.add("display");
};

const howtoCancel = () => {
  howtoContainer.classList.remove("display");
};

const qrChecked = () => {
  document
    .getElementsByClassName("additButtonContainer")[1]
    .classList.add("displayNone");
  howtoContainer.classList.remove("display");
  nfcContainer.classList.remove("display");
  webcamOverlay.classList.add("normal");
  temperature.classList.add("normal");
  alertText.innerText = "";
  temperature.innerText = qrCheckCompleted;
  speech(qrCheckCompleted);
  webcamOverlay.classList.add("display");
  setTimeout(() => {
    showMenu();
  }, 3000);
};

const showMenu = () => {
  for (e of menu) {
    if (!menuJson[e.category]) {
      menuCategory.innerHTML = `${menuCategory.innerHTML}<div class="category${
        !category.length ? " selected" : ""
      }" onclick="categorySelected(${category.length})">${
        lang == "ko" ? e.category : e.categoryEn
      }</div>`;
      category.push(e.category);
      menuJson[e.category] = [];
    }
    menuJson[e.category].push(e);
  }
  categorySelected(0);
  tempContainer.classList.add("fadeOut");
  setTimeout(() => {
    tempContainer.style.display = "none";
  }, 1000);
};

const menuScroll = (e) => {
  selection = Math.round(e.scrollLeft / (window.innerWidth / 5));
  let menu = menuJson[category[categorySelection]][selection];
  menuFocusImage.src = `${menu.image}${menu.menu}.png`;
  menuImage.src = `${menu.image}${menu.menu}.png`;
  if (lang == "ko") {
    menuNameSub.innerText = menu.menuEn;
    menuName.innerText = menu.menu;
  } else {
    menuNameSub.innerText = menu.menu;
    menuName.innerText = menu.menuEn;
  }
  menuPrice.innerText = menu.amount.toLocaleString("ko-KR");
  let t = e.scrollLeft;
  setTimeout(() => {
    compare(t);
  }, 300);
};

const compare = (t) => {
  if (menuSelection.scrollLeft == t) {
    const raf = (start, end, t) => {
      menuSelection.scrollLeft = start + ((end - start) / 10) * t;
      if (t == 10) return;
      requestAnimationFrame(() => {
        raf(start, end, t + 1);
      });
    };
    raf(menuSelection.scrollLeft, (window.innerWidth / 5) * selection, 1);
  }
};

const categorySelected = (n) => {
  categorySelection = n;
  menuSelection.scrollLeft = 0;
  menuScroll({ scrollLeft: 0 });
  selection = 0;
  menuList.innerHTML = "";
  document.getElementsByClassName("selected")[0].classList.remove("selected");
  document.getElementsByClassName("category")[n].classList.add("selected");
  let i = 0;
  for (e of menuJson[category[n]]) {
    menuList.innerHTML = `${menuList.innerHTML}
                          <div class="menu" onclick="menuSelected(${i})">
                            <img src="${e.image}${e.menu}.png"
                              class="menuListImage">
                            <span class="menuListName">${
                              lang == "ko" ? e.menu : e.menuEn
                            }</span>
                            <span class="menuListPrice">
                              ${e.amount.toLocaleString("ko-KR")}
                            </span>
                          </div>`;
    i++;
  }
};

const menuSelected = (n) => {
  const raf = (start, end, t) => {
    menuSelection.scrollLeft = start + ((end - start) / 10) * t;
    if (t == 10) return;
    requestAnimationFrame(() => {
      raf(start, end, t + 1);
    });
  };
  raf(menuSelection.scrollLeft, (window.innerWidth / 5) * n, 1);
};

const addToCart = () => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i] == menuJson[category[categorySelection]][selection]) {
      cart[i].count++;
      updateCart();
      return;
    }
  }
  cart.push(menuJson[category[categorySelection]][selection]);
  cart[cart.length - 1].count = 1;
  updateCart();
};

const updateCart = () => {
  menuCartList.innerHTML = "";
  let count = 0;
  amount = 0;
  for (let i = 0; i < cart.length; i++) {
    let menu = cart[i];
    count += menu.count;
    amount += menu.amount * menu.count;
    menuCartList.innerHTML = `${menuCartList.innerHTML}
    <div class="menuCartElement">
      <div class="menuCartImageContainer">
        <img src="${menu.image}${menu.menu}.png" class="menuCartImage">
      </div>
      <div class="menuCartInformation">
        <span class="menuCartTextMenu">${
          lang == "ko" ? menu.menu : menu.menuEn
        }</span>
        <span class="menuCartTextAmount">${(
          menu.amount * menu.count
        ).toLocaleString("ko-KR")}</span>
      </div>
      <div class="menuCartAmount">
        <img src="/images/arrow_up.svg" class="menuCartAmountArrow" onclick="countUp(${i})">
        <span class="menuCartAmountText">${menu.count}개</span>
        <img src="/images/arrow_down.svg" class="menuCartAmountArrow" onclick="countDown(${i})">
      </div>
      <div class="menuCartRemove" onclick="deleteCart(${i})">
        <img src="/images/delete.svg" id="delete">
      </div>
    </div>`;
  }
  cartCount.innerText = count;
  totalValue.innerText = amount.toLocaleString("ko-KR");
};

const countUp = (n) => {
  cart[n].count++;
  updateCart();
};

const countDown = (n) => {
  if (cart[n].count == 1) return;
  cart[n].count--;
  updateCart();
};

const deleteCart = (n) => {
  cart.splice(n, 1);
  updateCart();
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
