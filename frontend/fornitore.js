var loggedUser = {};

function login() {
  document.getElementById("loginError").textContent = "";
  //get the form object
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  if (email == "" || password == "") {
    document.getElementById("loginError").textContent =
      "Inserisci le credenziali";
  } else {
    fetch("../fornitore/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((resp) => resp.json()) // Transform the data into json
      .then(function (data) {
        // Here you get the data to modify as you please
        if (data.message) {
          document.getElementById("loginError").textContent = data.message;
        } else {
          loggedUser = data;
          updateAll();
          document.getElementById("loggedUser").textContent =
            "Fornitore loggato: " + loggedUser.email;
          document.getElementById("textMeals").textContent =
            "Tutti i meal del fornitore " + loggedUser.nomeAttivita;
          document.getElementById("loginform").style.display = "none";
          document.getElementById("logoutButton").style.display = "";
          document.getElementById("registrazione").style.display = "none";
          document.getElementById("divInserimentoMeal").style.display = "";
          document.getElementById("divAcquisti").style.display = "";
          document.getElementById("divFeedback").style.display = "";
        }
        return;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  }
}

function logout() {
  loggedUser = {};
  updateAll();
  document.getElementById("loginError").textContent = "";
  document.getElementById("loggedUser").textContent = "";
  document.getElementById("textMeals").textContent =
    "Tutti i meal del sistema (eseguire il login per visualizzare i meal del fornitore)";
  document.getElementById("loginform").style.display = "";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("registrazione").style.display = "";
  document.getElementById("divInserimentoMeal").style.display = "none";
  document.getElementById("divAcquisti").style.display = "none";
  document.getElementById("divFeedback").style.display = "none";
  return;
}

function registrazione() {
  document.getElementById("registrazioneError").textContent = "";
  //get the form object
  var email = document.getElementById("registrazioneEmail").value;
  var password = document.getElementById("registrazionePassword").value;
  var nomeAttivita = document.getElementById("registrazioneNomeAttivita").value;
  var indirizzoNegozio = document.getElementById(
    "registrazioneIndirizzoNegozio"
  ).value;
  var tipologiaAlimenti = document.getElementById(
    "registrazioneTipologiaAlimenti"
  ).value;
  var IBAN = document.getElementById("registrazioneIBAN").value;
  var immagine = "";

  if (
    email == "" ||
    password == "" ||
    nomeAttivita == "" ||
    indirizzoNegozio == "" ||
    tipologiaAlimenti == "" ||
    IBAN == ""
  ) {
    document.getElementById("registrazioneError").textContent =
      "Riempi tutti i campi";
  } else {
    fetch("../fornitore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        nomeAttivita: nomeAttivita,
        indirizzoNegozio: indirizzoNegozio,
        tipologiaAlimenti: tipologiaAlimenti,
        IBAN: IBAN,
        immagine: immagine,
      }),
    })
      .then((resp) => resp.json()) // Transform the data into json
      .then(function (data) {
        if (data.message) {
          document.getElementById("registrazioneError").textContent =
            data.message;
        } else {
          document.getElementById("registrazioneError").textContent =
            "Registrazione effettuata con successo";
          document.getElementById("registrazioneEmail").value = "";
          document.getElementById("registrazionePassword").value = "";
          document.getElementById("registrazioneNomeAttivita").value = "";
          document.getElementById("registrazioneIndirizzoNegozio").value = "";
          document.getElementById("registrazioneTipologiaAlimenti").value = "";
          document.getElementById("registrazioneIBAN").value = "";
        }
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  }
}

function loadMeals() {
  const ul = document.getElementById("meals"); // Get the list where we will place our authors

  ul.textContent = "";

  link = "";
  if (loggedUser.id) {
    link = "../meal?fornitore=" + loggedUser.id;
  } else {
    link = "../meal";
  }
  fetch(link)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please

      let i = 1;

      if (data.length > 0) {
        return data.map(function (meal) {
          // Map through the results and for each run the code below

          let li = document.createElement("li");
          li.classList.add("list-group-item");
          li.classList.add("list-group-item-action");
          li.classList.add("p-4");
          li.classList.add("list-group-item-dark");
          let data = document.createTextNode(
            i +
              ". " +
              ' Dimensione: "' +
              meal.dimensione +
              '", disponibilità: "' +
              meal.disponibilita +
              '", prezzo: "' +
              meal.prezzo +
              '"'
          );
          li.appendChild(data);
          if (loggedUser.id) {
            if (meal.disponibilita == true) {
              li.appendChild(document.createTextNode("\t"));
              let button = document.createElement("button");
              button.type = "button";
              button.classList.add("bottone");
              button.onclick = () => deleteMeal(meal._id);
              button.textContent = "Elimina";
              li.appendChild(button);
            }
          } else {
            fetch("../fornitore/" + meal.fornitore, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            })
              .then((resp) => resp.json()) // Transform the data into json
              .then(function (forn) {
                data.textContent += ', fornitore: "' + forn.nomeAttivita + '"';
                return;
              })
              .catch((error) => console.error(error)); // If there is any error you will catch them here
          }
          ul.appendChild(li);
          i++;
        });
      } else {
        let li = document.createElement("li");

        let data = document.createTextNode(
          "Al momento non ci sono meal nel sistema"
        );
        li.appendChild(data);
        ul.appendChild(li);
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}
loadMeals();

function insertMeal() {
  document.getElementById("inserimentoError").textContent = "";
  //get the book title
  var dimensione = document.getElementById("dimensioneMeal").value;
  var prezzo = document.getElementById("prezzoMeal").value;

  if (prezzo.length != 0) {
    console.log("ok");
    fetch("../meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fornitore: loggedUser.id,
        dimensione: dimensione,
        prezzo: prezzo,
        token: loggedUser.token,
      }),
    })
      .then((resp) => {
        console.log(resp);
        loadMeals();
        return;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  } else {
    document.getElementById("inserimentoError").textContent =
      "Inserire tutti i parametri";
  }
}

function deleteMeal(id) {
  //get the book title
  fetch("../meal/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => {
      loadMeals();
      return;
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function getRichiesteAcquisto() {
  const ul = document.getElementById("acquisti"); // Get the list where we will place our authors

  ul.textContent = "";
  fetch("../acquisto")
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please

      let i = 1;

      if (data.length > 0) {
        return data.map(function (acquisto) {
          // Map through the results and for each run the code below
          fetch("../meal/" + acquisto.meal, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (meal) {
              if (
                meal.fornitore == loggedUser.id &&
                meal.disponibilita != true &&
                acquisto.stato == "in attesa"
              ) {
                let li = document.createElement("li");

                let data = document.createTextNode(
                  i +
                    ". " +
                    ' Dimensione: "' +
                    meal.dimensione +
                    '", disponibilità: "' +
                    meal.disponibilita +
                    '", prezzo: "' +
                    meal.prezzo +
                    '", intolleranze: "' +
                    acquisto.intolleranze +
                    '"\t'
                );
                li.appendChild(data);
                let butAccetta = document.createElement("button");
                butAccetta.type = "button";
                butAccetta.classList.add("bottone");
                butAccetta.onclick = () =>
                  updateAcquisto(acquisto._id, "acquistato");
                butAccetta.textContent = "Accetta";
                li.appendChild(butAccetta);
                let butRifiuta = document.createElement("button");
                butRifiuta.type = "button";
                butRifiuta.classList.add("bottone");
                butRifiuta.onclick = () =>
                  updateAcquisto(acquisto._id, "rifiutato");
                butRifiuta.textContent = "Rifiuta";
                li.appendChild(butRifiuta);
                ul.appendChild(li);
                i++;
              }
            })
            .catch((error) => console.error(error)); // If there is any error you will catch them here
        });
      } else {
        let li = document.createElement("li");
        let data = document.createTextNode("Nessun meal acquistato");
        li.appendChild(data);
        ul.appendChild(li);
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function loadFeedback() {
  const ul = document.getElementById("feedback"); // Get the list where we will place our authors

  ul.textContent = "";

  fetch("../feedback?fornitore=" + loggedUser.id)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please

      let i = 1;
      if (data.length > 0) {
        return data.map(function (feedback) {
          // Map through the results and for each run the code below
          console.log(feedback);

          let li = document.createElement("li");

          let data = document.createTextNode(
            i +
              ". " +
              ' Valutazione: "' +
              feedback.valutazione +
              '", commento: "' +
              feedback.commento +
              '"'
          );
          li.appendChild(data);
          ul.appendChild(li);
          i++;
        });
      } else {
        let li = document.createElement("li");

        let data = document.createTextNode(
          "Al momento non ci sono feedback sul tuo locale"
        );
        li.appendChild(data);
        ul.appendChild(li);
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function updateAcquisto(id, stato) {
  console.log(stato);
  fetch("../acquisto/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stato: stato,
    }),
  })
    .then((resp) => {
      updateAll();
      return;
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function updateAll() {
  loadMeals();
  getRichiesteAcquisto();
  loadFeedback();
}
