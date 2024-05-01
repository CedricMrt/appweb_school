const project = {
  niffleurParentElement: document.querySelector(".niffleur"),
  niffleurImg: document.querySelector(".niffleurImg"),
  bubbleElement: document.querySelector(".bubble"),
  activityBox: document.querySelector("#box-outer"),

  init: function () {
    setTimeout(function () {
      project.niffleurImg.classList.add("active");
    }, 1500);

    setTimeout(function () {
      project.bubbleElement.classList.add("active");
      project.activityBox.classList.add("active");
    }, 3000);

    setTimeout(function () {
      project.bubbleElement.classList.remove("active");
    }, 12000);
  },
};
project.init();
