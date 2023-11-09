# saveTheMeal

Il progetto ha come obiettivo l’eliminazione dello spreco di cibo, causato dalle scadenze, nella nostra società, grazie alla realizzazione di un sito web. L’applicazione deve permettere a ristoranti e a negozi di alimentari di pubblicare i loro Meal (cibo in prossimità di scadenza e/o rimasto invenduto) e deve permettere ai clienti di acquistarli, senza sapere però cosa ci sarà di preciso al loro interno.
In particolar modo:
• Un fornitore può registrare il proprio punto vendita, inserendo i propri dati e i le tipologie di pietanze che forniscono.
• Un fornitore può aggiungere le proposte di Meal. Dovrà inserire la dimensione dei Meal disponibili alla vendita, il costo e la fascia oraria per il ritiro.
• Un utente generico, non autenticato, che visita il sito può visualizzare i punti di ritiro vicino a sé o in una zona a sua scelta. Cliccando su uno specifico fornitore può vedere i dettagli dell’attività.
• Un utente anonimo può registrarsi ed effettuare il login assumendo il ruolo di utente autenticato. Così può acquistare un Meal, che potrà scegliere dalla visualizzazione precedente. All’acquisto è possibile specificare eventuali intolleranze: se presenti, il Meal viene reso non disponibile all’acquisto da parte di altri clienti e la richiesta viene messa in attesa, altrimenti si finalizza il pagamento. Successivamente ci sarà un metodo di riconoscimento al ritiro di persona del Meal.
• Il fornitore deve controllare se il cliente con intolleranze alimentari può ordinare il Meal. Nel caso in cui non si verifichino problemi di questo tipo il
Document: T30_AnalisiDeiRequisiti
3 / 15
fornitore accetta la richiesta del cliente. Se il Meal non è compatibile con la richiesta, il fornitore può rifiutarla e il Meal ritorna disponibile agli utenti.
• Un utente autenticato ha la possibilità di recensire i punti vendita. Si potrà dare una valutazione ad ogni punto vendita dove si è acquistato un Meal, indicandone i punti di forza e debolezza (riguardanti ad esempio: quantità di cibo, velocità del ritiro, rapporto qualità-prezzo, etc), e un commento.
