const loadingScreen = document.getElementById("loading-screen");
const progress = document.querySelector(".progress");
let load = 0;
const loadingInterval = setInterval(() => {
    load += 5;
    progress.style.width = load + "%";
    if (load >= 100) {
        clearInterval(loadingInterval);
        loadingScreen.style.display = "none";
    }
}, 100);

const themeBtn = document.getElementById("theme-btn");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
});
