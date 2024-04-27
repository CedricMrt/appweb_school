document.addEventListener("DOMContentLoaded", () => {
  const adminPanel = document.getElementById("adminPanel");
  const gamePanel = document.getElementById("gamePanel");

  const adminButton = document.createElement("button");
  adminButton.classList.add("button");
  adminButton.textContent = "Admin Panel";
  adminButton.onclick = toggleAdminPanel;
  document.querySelector(".navbar .container").appendChild(adminButton);

  const playButton = document.createElement("button");
  playButton.classList.add("button");
  playButton.textContent = "Play Game";
  playButton.onclick = startGame;
  document.querySelector(".navbar .container").appendChild(playButton);
});

const toggleAdminPanel = () => {
  const adminPanel = document.getElementById("adminPanel");
  adminPanel.classList.toggle("hidden");
  if (!adminPanel.classList.contains("hidden")) {
    document.getElementById("password").focus();
  }
};

const authenticateAdmin = () => {
  const password = document.getElementById("password").value;
  if (password !== "2209") {
    alert("Incorrect password! Please try again.");
    return;
  }
  startGame();
};

const startGame = () => {
  const adminPanel = document.getElementById("adminPanel");
  const gamePanel = document.getElementById("gamePanel");
  adminPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");
  generateQuestion();

  // Hide the Play Game button
  const playButton = document.querySelector(
    ".navbar .container button:last-child"
  );
  playButton.style.display = "none";
};

const generateQuestion = () => {
  const selectedTable = getRandomTable();
  const num1 = selectedTable;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = num1 * num2;
  let options = [correctAnswer];
  while (options.length < 3) {
    const option = Math.floor(Math.random() * 100) + 1; // Generate random numbers for incorrect options
    if (!options.includes(option) && option !== correctAnswer) {
      options.push(option);
    }
  }
  options = shuffle(options); // Randomize the order of options
  const question = `${num1} x ${num2} = ?`;
  document.getElementById("question").textContent = question;
  document.getElementById("options").innerHTML = ""; // Clear previous options
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className = "option";
    button.onclick = () => {
      checkAnswer(option, correctAnswer);
    };
    document.getElementById("options").appendChild(button);
  });
};

const checkAnswer = (userAnswer, correctAnswer) => {
  if (userAnswer == correctAnswer) {
    document.getElementById("feedback").textContent = "Bravo, bonne réponse";
  } else {
    document.getElementById("feedback").textContent =
      "Incorrect. Essaye encore!";
  }
  generateQuestion(); // Generate a new question after each answer
};

const getRandomTable = () => {
  const selectedTables = Array.from(
    document.getElementById("multiplication-table").selectedOptions,
    (option) => parseInt(option.value)
  );
  if (selectedTables.length === 0) {
    return Math.floor(Math.random() * 10) + 1; // If no table selected, choose a random one
  }
  return selectedTables[Math.floor(Math.random() * selectedTables.length)];
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Using array destructuring to swap elements
  }
  return array;
};
