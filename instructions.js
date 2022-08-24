const instructions = document.querySelector("#instructions");
const closeInstructions = document.querySelector("#closeInstructions");

function closeInst(e) {
  modalInstructions.classList.remove("active");
  document.querySelector(".modal-instructions-wrapper").style.display = "none";
}

instructions.addEventListener("click", () => {
  modalInstructions.classList.add("active");
  document.querySelector(".modal-instructions-wrapper").style.display = "block";
});

closeInstructions.addEventListener("click", () => {
  closeInst();
});

if (Notification.permission !== "denied") {
  Notification.requestPermission();
}

function showNotification() {
  const notification = new Notification("Productivity App", {
    body: "Hi there. The current session has ended!",
  });
}
