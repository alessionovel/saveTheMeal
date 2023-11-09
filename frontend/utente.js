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
    fetch("../utente/login", {
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
            "Utente loggato: " + loggedUser.email;
          document.getElementById("loginform").style.display = "none";
          document.getElementById("logoutButton").style.display = "";
          document.getElementById("registrazione").style.display = "none";
          document.getElementById("mealsUtente").style.display = "";
          document.getElementById("divIntolleranze").style.display = "";
          document.getElementById("feedback").style.display = "";
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
  document.getElementById("loginform").style.display = "";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("registrazione").style.display = "";
  document.getElementById("mealsUtente").style.display = "none";
  document.getElementById("divIntolleranze").style.display = "none";
  document.getElementById("feedback").style.display = "none";
  return;
}

function registrazione() {
  document.getElementById("registrazioneError").textContent = "";
  //get the form object
  var email = document.getElementById("registrazioneEmail").value;
  var password = document.getElementById("registrazionePassword").value;
  var nome = document.getElementById("registrazioneNome").value;
  var cognome = document.getElementById("registrazioneCognome").value;

  if (email == "" || password == "" || nome == "" || cognome == "") {
    document.getElementById("registrazioneError").textContent =
      "Riempi tutti i campi";
  } else {
    fetch("../utente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        nome: nome,
        cognome: cognome,
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
          document.getElementById("registrazioneNome").value = "";
          document.getElementById("registrazioneCognome").value = "";
        }
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  }
}

function loadFornitori() {
  var select = document.getElementById("fornitori");
  var i,
    L = select.options.length - 1;
  for (i = L; i >= 0; i--) {
    select.remove(i);
  }

  fetch("../fornitore")
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please
      if (data.length > 0) {
        data.map(function (fornitore) {
          // Map through the results and for each run the code below
          var opt = document.createElement("option");
          opt.value = fornitore._id;
          opt.innerHTML = fornitore.nomeAttivita;
          select.appendChild(opt);
        });
        loadMeals();
      } else {
        var opt = document.createElement("option");
        opt.value = 0;
        opt.innerHTML = "Nessun fornitore disponibile";
        select.appendChild(opt);
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}
loadFornitori();

function loadMeals() {
  const ul = document.getElementById("meals"); // Get the list where we will place our authors

  ul.textContent = "";

  let fornitore = document.getElementById("fornitori").value;
  if (fornitore != 0) {
    fetch("../meal?fornitore=" + fornitore)
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
                'Dimensione: "' +
                meal.dimensione +
                '", disponibilità: "' +
                meal.disponibilita +
                '", prezzo: "' +
                meal.prezzo +
                '"\t'
            );
            li.appendChild(data);
            if (loggedUser.id) {
              if (meal.disponibilita == true) {
                let button = document.createElement("button");
                button.type = "button";
                button.classList.add("bottone");
                button.onclick = () => acquistaMeal(meal._id);
                button.textContent = "Acquista";
                li.appendChild(button);
              }
            }
            ul.appendChild(li);
            i++;
          });
        } else {
          let li = document.createElement("li");

          let data = document.createTextNode(
            "Al momento non ci sono meal per questo fornitore"
          );
          li.appendChild(data);
          ul.appendChild(li);
        }
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  }
}

function loadMealsUtente() {
  const ul = document.getElementById("meals2"); // Get the list where we will place our authors

  ul.textContent = "";

  let utente = loggedUser.id;

  fetch("../acquisto?utente=" + utente)
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
              fetch("../fornitore/" + meal.fornitore, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              })
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (forn) {
                  let li = document.createElement("li");

                  let text =
                    i +
                    ". " +
                    ' Fornitore: "' +
                    forn.nomeAttivita +
                    '", dimensione: "' +
                    meal.dimensione +
                    '", prezzo: "' +
                    meal.prezzo +
                    '", stato: "' +
                    acquisto.stato +
                    '", pagato: "' +
                    acquisto.isPaid +
                    '", borsa: "' +
                    acquisto.borsa +
                    '"';
                  if (acquisto.presenzaIntolleranze == true) {
                    text += ', intolleranze: "' + acquisto.intolleranze + '"';
                  }

                  let data = document.createTextNode(text);
                  li.appendChild(data);
                  ul.appendChild(li);
                  i++;
                  return;
                })
                .catch((error) => console.error(error)); // If there is any error you will catch them here
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

function acquistaMeal(id) {
  var intolleranze = document.getElementById("intolleranze").value;
  let presenzaIntolleranze = true;
  let stato = "in attesa";
  let borsa = document.querySelector('input[name="yes_no"]:checked').value;

  if (intolleranze.length == 0) {
    intolleranze = "";
    presenzaIntolleranze = false;
    stato = "acquistato";
  }

  fetch("../acquisto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meal: id,
      acquirente: loggedUser.id,
      presenzaIntolleranze: presenzaIntolleranze,
      intolleranze: intolleranze,
      isPaid: "false",
      borsa: borsa,
      stato: stato,
      token: loggedUser.token,
    }),
  })
    .then((resp) => {
      console.log(resp);
      updateAll();
      return;
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function loadFornitoriFeedback() {
  document.getElementById("feedbackError").textContent = "";
  document.getElementById("feedbackForm").style.display = "";
  var select = document.getElementById("fornitoriFeedback");
  var i,
    L = select.options.length - 1;
  for (i = L; i >= 0; i--) {
    select.remove(i);
  }
  fetch("../acquisto?utente=" + loggedUser.id)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please

      if (data.length > 0) {
        var i = 0;
        data.map(function (acquisto) {
          // Map through the results and for each run the code below
          fetch("../meal/" + acquisto.meal, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (meal) {
              fetch("../fornitore/" + meal.fornitore, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              })
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (fornitore) {
                  // Map through the results and for each run the code below
                  console.log(fornitore);
                  bool = true;
                  for (i = 0; i < select.length; ++i) {
                    if (select.options[i].value == fornitore._id) {
                      bool = false;
                    }
                  }
                  if (bool) {
                    var opt = document.createElement("option");
                    opt.value = fornitore._id;
                    opt.innerHTML = fornitore.nomeAttivita;
                    select.appendChild(opt);
                    if (i == 0) {
                      document.getElementById("fornitoriFeedback").value =
                        fornitore._id;
                      loadFeedback();
                    }
                    i++;
                  }
                })
                .catch((error) => console.error(error)); // If there is any error you will catch them here
            })
            .catch((error) => console.error(error)); // If there is any error you will catch them here
        });
      } else {
        var opt = document.createElement("option");
        opt.value = 0;
        opt.innerHTML = "Nessun meal acquistato";
        select.appendChild(opt);
        document.getElementById("feedbackForm").style.display = "none";
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function loadFeedback() {
  var fornitore = document.getElementById("fornitoriFeedback").value;
  var valutazione = document.getElementById("valutazione");
  var commento = document.getElementById("commento");
  var id = document.getElementById("feedbackID");
  var valore = document.getElementById("valoreValutazione");

  fetch("../feedback?utente=" + loggedUser.id + "&fornitore=" + fornitore)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function (data) {
      // Here you get the data to modify as you please

      if (data.length > 0) {
        let feedback = data[0];
        valutazione.value = feedback.valutazione;
        commento.value = feedback.commento;
        id.value = feedback._id;
        valore.textContent = feedback.valutazione;
        console.log(feedback);
      } else {
        valutazione.value = 0;
        commento.value = "";
        id.value = 0;
        valore.textContent = 0;
      }
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

function valoreValutazione() {
  var valore = document.getElementById("valoreValutazione");
  var valutazione = document.getElementById("valutazione");

  valore.textContent = valutazione.value;
}

function caricaFeedback() {
  document.getElementById("feedbackError").textContent = "";
  var fornitore = document.getElementById("fornitoriFeedback").value;
  var valutazione = document.getElementById("valutazione");
  var commento = document.getElementById("commento");
  var id = document.getElementById("feedbackID");

  if (id.value != 0) {
    //get the book title
    fetch("../feedback/" + id.value, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        fetch("../feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fornitore: fornitore,
            utente: loggedUser.id,
            valutazione: valutazione.value,
            puntiDiForza: "",
            commento: commento.value,
            token: loggedUser.token,
          }),
        })
          .then((resp) => {
            updateAll();
            document.getElementById("feedbackError").textContent =
              "Feedback inviato";
            return;
          })
          .catch((error) => console.error(error)); // If there is any error you will catch them here
        return;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
  } else {
    fetch("../feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fornitore: fornitore,
        utente: loggedUser.id,
        valutazione: valutazione.value,
        puntiDiForza: "",
        commento: commento.value,
        token: loggedUser.token,
      }),
    })
      .then((resp) => {
        updateAll();
        document.getElementById("feedbackError").textContent =
          "Feedback inviato";
        return;
      })
      .catch((error) => console.error(error)); // If there is any error you will catch them here
    return;
  }
}

function updateAll() {
  loadFornitori();
  loadMealsUtente();
  loadFornitoriFeedback();
}
