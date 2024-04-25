const niffleurImg = document.querySelector(".niffleurImg");
const bubbleElement = document.querySelector(".bubble");
const activityBox = document.querySelector(".box-outer");

setInterval(function () {
  niffleurImg.classList.add("active");
}, 2500);

setInterval(function () {
  bubbleElement.classList.add("active");
  activityBox.classList.add("active");
}, 3500);

setInterval(function () {
  bubbleElement.remove();
}, 12000);
