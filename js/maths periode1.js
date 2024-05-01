$(document).ready(function () {
  let selectedDifficulty, selectedOrder, selectedDifficulty2;
  let sortableInitialized = false;
  let activity1IsRunning = false;
  let activity2IsRunning = false;
  let selectedDifficulty3, selectedOperation;
  let activity3IsRunning = false;

  // Événement de clic sur les activités
  $(".activity").on("click", function () {
    const activityId = this.id;

    switch (activityId) {
      case "activity1":
        showActivityControls();
        break;
      case "activity2":
        showActivity2Controls();
        break;
      case "activity3":
        showActivity3Controls();
        break;
      default:
        console.log("Activité non reconnue");
    }
  });

  // Fonction pour afficher les contrôles de l'activité 1
  function showActivityControls() {
    $("#activityControls").show();
    $("#activity2Controls").hide();
    $("#activity3Controls").hide(); // Cache les contrôles de l'activité 2
    $(".sortable-list").hide();
    $(".comparison-activity").hide();
    activity1IsRunning = true;
    activity2IsRunning = false;
    activity3IsRunning = false;
    sortableInitialized = false;
  }

  // Fonction pour afficher les contrôles de l'activité 2
  function showActivity2Controls() {
    $("#activityControls").hide(); // Cache les contrôles de l'activité 1
    $("#activity2Controls").show();
    $("#activity3Controls").hide();
    $(".sortable-list").hide();
    $(".comparison-activity").hide();
    activity1IsRunning = false;
    activity2IsRunning = true;
    activity3IsRunning = false;
  }

  // Fonction pour démarrer l'activité de classement des nombres
  $("#startActivity").on("click", function () {
    selectedDifficulty = $("#difficulty").val();
    selectedOrder = $("#order").val();

    const maxRange =
      selectedDifficulty === "facile"
        ? 20
        : selectedDifficulty === "moyen"
        ? 60
        : 70;
    const numbers = generateNumbers(maxNumber, 0, maxRange);

    let message = `Classe les nombres dans l'ordre ${selectedOrder} en les faisant glisser.`;

    showSortableDialog(numbers, message);
  });

  // Gestionnaire d'événement pour le bouton Valider
  $(document).on("click", "#validate", function () {
    const sortedItems = $("#sortable").find("li");
    const sortedValues = [];
    sortedItems.each(function () {
      sortedValues.push(parseInt($(this).text()));
    });

    const isSortedCorrectly = isSorted(sortedValues, selectedOrder);
    if (isSortedCorrectly) {
      $(".result").text("Bravo ! Les nombres sont classés correctement.");
      setTimeout(function () {
        const maxRange =
          selectedDifficulty === "facile"
            ? 20
            : selectedDifficulty === "moyen"
            ? 60
            : 70;
        const numbers = generateNumbers(maxNumber, 0, maxRange);

        let message = `Classe les nombres dans l'ordre ${selectedOrder} en les faisant glisser.`;

        showSortableDialog(numbers, message);
      }, 1000);
    } else {
      $(".result").text(
        "Désolé, la liste n'est pas correctement classée. Veuillez réessayer."
      );
    }
  });

  // Fonction pour afficher la boîte de dialogue pour classer les nombres
  function showSortableDialog(numbers, message) {
    $("#sortable").empty();

    numbers.forEach((num) => {
      const item = $("<li>").text(num);
      $("#sortable").append(item);
    });

    $(".result").text(message);

    $(".sortable-list").show();
    if (!sortableInitialized) {
      $("#sortable").sortable();
      sortableInitialized = true;
    }
  }

  // Fonction pour générer une liste aléatoire de nombres
  function generateNumbers(max, min, maxRange) {
    const numbers = new Set();

    while (numbers.size < max) {
      const randomNumber =
        Math.floor(Math.random() * (maxRange - min + 1)) + min;
      numbers.add(randomNumber);
    }

    return Array.from(numbers);
  }

  // Fonction pour vérifier si un tableau est trié dans l'ordre spécifié
  function isSorted(arr, order) {
    if (order === "croissant") {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < arr[i + 1]) {
          return false;
        }
      }
    }
    return true;
  }

  // Événement pour démarrer l'activité 2
  $("#startActivity2").on("click", function () {
    selectedDifficulty2 = $("#difficulty2").val();
    const maxRange =
      selectedDifficulty2 === "facile"
        ? 20
        : selectedDifficulty2 === "moyen"
        ? 60
        : 70;

    const number1 = Math.floor(Math.random() * (maxRange + 1));
    const number2 = Math.floor(Math.random() * (maxRange + 1));

    $("#number1").text(number1);
    $("#number2").text(number2);

    $(".comparison-activity").show();
  });

  // Événement pour valider l'activité 2
  $("#validate2").on("click", function () {
    const number1 = parseInt($("#number1").text());
    const number2 = parseInt($("#number2").text());

    const selectedSymbol = $(".selected").text();

    let result = "";
    if (selectedSymbol === ">") {
      result = number1 > number2 ? "Bravo !" : "Désolé, mauvaise réponse.";
    } else if (selectedSymbol === "=") {
      result = number1 === number2 ? "Bravo !" : "Désolé, mauvaise réponse.";
    } else if (selectedSymbol === "<") {
      result = number1 < number2 ? "Bravo !" : "Désolé, mauvaise réponse.";
    }

    $(".result2").text(result);

    // Si la réponse est correcte, générer de nouveaux nombres
    if (result === "Bravo !") {
      $("#comparisonSymbol").text("");
      regenerateActivity2List();
    } else if (result === "Désolé, mauvaise réponse.") {
      $("#comparisonSymbol").text("");
    }
  });

  // Événement pour sélectionner le symbole de comparaison
  $("#drag-container div").draggable({
    revert: true,
    /* snap: ".comparison-activity",
    snapMode: "inner", */
  });

  $("#comparisonSymbol").droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      $(this).text(ui.draggable.text());
      $(this).addClass("selected");
    },
  });

  // Événement pour détecter le changement de difficulté pour l'activité 1
  $("#difficulty").on("change", function () {
    selectedDifficulty = $(this).val();
    if (activity1IsRunning) {
      // Vérifie si l'activité 1 est en cours
      regenerateActivity1List(); // Régénère la liste pour l'activité 1 avec les nouvelles valeurs
    }
  });

  // Événement pour détecter le changement de l'ordre de classement pour l'activité 1
  $("#order").on("change", function () {
    selectedOrder = $(this).val();
    if (activity1IsRunning) {
      // Vérifie si l'activité 1 est en cours
      regenerateActivity1List(); // Régénère la liste pour l'activité 1 avec les nouvelles valeurs
    }
  });

  // Événement pour détecter le changement de difficulté pour l'activité 2
  $("#difficulty2").on("change", function () {
    selectedDifficulty2 = $(this).val();
    if (activity2IsRunning) {
      // Vérifie si l'activité 2 est en cours
      regenerateActivity2List(); // Régénère la liste pour l'activité 2 avec les nouvelles valeurs
    }
  });

  // Ajoutez des fonctions pour régénérer les listes pour chaque activité
  function regenerateActivity1List() {
    const maxRange =
      selectedDifficulty === "facile"
        ? 20
        : selectedDifficulty === "moyen"
        ? 60
        : 70;
    const numbers = generateNumbers(maxNumber, 0, maxRange);

    let message = `Classe les nombres dans l'ordre ${selectedOrder} en les faisant glisser.`;

    showSortableDialog(numbers, message);
  }

  function regenerateActivity2List() {
    const maxRange =
      selectedDifficulty2 === "facile"
        ? 20
        : selectedDifficulty2 === "moyen"
        ? 60
        : 70;
    const number1 = Math.floor(Math.random() * (maxRange + 1));
    const number2 = Math.floor(Math.random() * (maxRange + 1));

    $("#number1").text(number1);
    $("#number2").text(number2);
  }
});

function regenerateActivity3List() {
  const maxRange =
    selectedDifficulty3 === "facile"
      ? 20
      : selectedDifficulty3 === "moyen"
      ? 60
      : 70;

  const number1 = Math.floor(Math.random() * maxRange) + 1;
  const number2 = Math.floor(Math.random() * maxRange) + 1;
  // Trie les nombres dans l'ordre décroissant
  const sortedNumbers = [number1, number2].sort((a, b) => b - a);
  const sortedNumber1 = sortedNumbers[0];
  const sortedNumber2 = sortedNumbers[1];

  // Affichage de la question
  $("#numbers1").text(sortedNumber1);
  $("#numbers2").text(sortedNumber2);
  $("#operationSymbol").text(selectedOperation === "addition" ? "+" : "-");
  $(".calculation").show();
  $("#userAnswer").val("");
}

// activité 3

// Fonction pour afficher les contrôles de l'activité 3
function showActivity3Controls() {
  $("#activityControls").hide();
  $("#activity2Controls").hide();
  $("#activity3Controls").show();
  $("#activity4Controls").hide();
  $(".sortable-list").hide();
  $(".comparison-activity").hide();
  $(".calculation").hide();
  activity3IsRunning = true;
}

// Fonction pour démarrer l'activité 3
$("#startActivity3").on("click", function () {
  selectedDifficulty3 = $("#difficulty3").val();
  selectedOperation = $("#operation").val();

  const maxRange =
    selectedDifficulty3 === "facile"
      ? 20
      : selectedDifficulty3 === "moyen"
      ? 60
      : 70;

  const number1 = Math.floor(Math.random() * maxRange) + 1;
  const number2 = Math.floor(Math.random() * maxRange) + 1;
  // Trie les nombres dans l'ordre décroissant
  const sortedNumbers = [number1, number2].sort((a, b) => b - a);
  const sortedNumber1 = sortedNumbers[0];
  const sortedNumber2 = sortedNumbers[1];

  // Affichage de la question
  $("#numbers1").text(sortedNumber1);
  $("#numbers2").text(sortedNumber2);
  $("#operationSymbol").text(selectedOperation === "addition" ? "+" : "-");
  $(".calculation").show();
  showResultMessage(""); // Efface tout message précédent
});

// Événement pour valider la réponse
$("#validate3").on("click", function () {
  const number1 = parseInt($("#numbers1").text());
  const number2 = parseInt($("#numbers2").text());
  const userAnswer = parseInt($("#userAnswer").val());

  let correctAnswer;
  if (selectedOperation === "addition") {
    correctAnswer = number1 + number2;
  } else {
    correctAnswer = Math.abs(number1 - number2);
  }

  if (userAnswer === correctAnswer) {
    showResultMessage("Bravo !");
    regenerateActivity3List();
  } else {
    showResultMessage("Désolé, mauvaise réponse.");
  }
});

// Fonction pour afficher un message de résultat
function showResultMessage(message) {
  $(".result3").text(message);
}

// Événement pour détecter le changement de difficulté pour l'activité 3
$("#difficulty3").on("change", function () {
  selectedDifficulty3 = $(this).val();
  if (activity3IsRunning) {
    regenerateActivity3List();
    // Vérifie si l'activité 3 est en cours
    // Vous pouvez ajouter du code ici pour régénérer les nombres avec la nouvelle difficulté si nécessaire
  }
});

$("#operation").on("change", function () {
  selectedOperation = $(this).val();
  if (activity3IsRunning) {
    regenerateActivity3List();
    // Vérifie si l'activité 3 est en cours
    // Vous pouvez ajouter du code ici pour régénérer les nombres avec la nouvelle difficulté si nécessaire
  }
});

// Autres fonctions et événements...
