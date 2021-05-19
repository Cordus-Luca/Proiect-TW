const body = document.getElementById('body');
const main = document.getElementById('main');

// Form variables
const formNume = document.getElementById('formNume');
const formPret = document.getElementById('formPret');
const formData = document.getElementById('formData');
const formPoza = document.getElementById('formPoza');
const formMagazin = document.getElementById('formMagazin');

let saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');

const listaLink = document.getElementById('lista-link');
const contactLink = document.getElementById('contact-link');

// Add button
let addButton = document.createElement('button');
addButton.className = "button";

// Add event on add button
addButton.addEventListener('click', openAddModal);
addButton.textContent = " + Adauga Piesa";

// Add button container
let addButtonContainer = document.createElement('div');
addButtonContainer.className = "add__container";
addButtonContainer.appendChild(addButton);

body.append(addButtonContainer);

// Fetch parti
function getPartiFromServer() {
    addButtonContainer.className = "add__container";
    body.append(addButtonContainer);
    fetch('http://localhost:3000/parti')
        .then(function (response) {
            // Trasform server response to plain object
            response.json().then(function (parti) {
                renderPartiListPage(parti);
            });
        });
};

// Get parte
function getParteFromServer(id) {
    fetch(`http://localhost:3000/parti/${id}`)
        .then(function (response) {
            // Trasform server response to plain object
            response.json().then(function (parti) {
                renderPartePage(parti);
            });
        });
};

// Add parte
function addParteToServer() {
    // creat post object
    const postObject = {
        nume: formNume.value,
        pret: formPret.value,
        data: formData.value,
        magazin: formMagazin.value,
        poza: formPoza.value
    }
    // Call post request to add a new parte
    fetch('http://localhost:3000/parti', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        // Get new lista parti
        getPartiFromServer();

        // Reset Form
        resetForm();

        // Close Modal
        closeModal();
    });
}

// Delete parte
function deleteParteFromServer(id) {
    // Delete request pentru parte
    fetch(`http://localhost:3000/parti/${id}`, {
        method: 'DELETE',
    }).then(function () {
        // Get the new lista parti
        getPartiFromServer();
    });
}

// Update parte
function updateParteToServer(id) {
    // creat put object
    const putObject = {
        nume: formNume.value,
        pret: formPret.value,
        data: formData.value,
        magazin: formMagazin.value,
        poza: formPoza.value
    }
    // Call put request to update parte
    fetch(`http://localhost:3000/parti/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        // Get the new lista parti
        getPartiFromServer();

        // Reset Form
        resetForm();

        // Close Modal
        closeModal();
    });
}

// Copy edited parte information to form and add event listener on update button
function openAddModal() {

    // clear all events save button events
    clearSaveButtonEvents();

    saveButton.addEventListener('click', function () {
        addParteToServer()
    });

    body.className = 'show-modal';
}

// Copy edited parte information to form and add event listener on update button
function openEditModal(parte) {
    // Copy parte information to form
    formNume.value = parte.nume;
    formPoza.value = parte.poza;
    formPret.value = parte.pret;
    formData.value = parte.data;
    formMagazin.value = parte.magazin;

    // clear all events update button events
    clearSaveButtonEvents();

    saveButton.addEventListener('click', function () {
        updateParteToServer(parte.id)
    });

    body.className = 'show-modal';
}

// Remove parti list if exist
function removeOldPartiFromDOM() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

// Create DOM Objects
function createParteListDOMNodes(parte) {

    // Add button
    let addButton = document.createElement('button');
    addButton.className = "button";

    // Add event on add button
    addButton.addEventListener('click', openAddModal);
    addButton.textContent = " + Adauga Piesa";

    // Add button container
    let addButtonContainer = document.createElement('div');
    addButtonContainer.className = "add__container";
    addButtonContainer.appendChild(addButton);

    // Nume
    let nume = document.createElement('h2');
    nume.className = "nume";
    nume.textContent = parte.nume;

    // Pret
    let pret = document.createElement('li');
    pret.className = "pret";
    pret.textContent = parte.pret;

    // Data
    let data = document.createElement('li');
    data.className = "data";
    data.textContent = parte.data;

    // Magazin
    let magazin = document.createElement('li');
    magazin.className = "magazin";
    magazin.textContent = parte.magazin;

    // Poza
    let poza = document.createElement('img');
    poza.className = "poza";
    poza.src = parte.poza;

    // Information container
    let infoContainer = document.createElement('ul');
    infoContainer.className = "info__container";
    infoContainer.appendChild(nume);
    infoContainer.appendChild(pret);
    infoContainer.appendChild(data);
    infoContainer.appendChild(magazin);
    infoContainer.appendChild(poza);

    // Edit button
    let editButton = document.createElement('button');
    editButton.className = "actions__btn";

    // Add event on edit button and pass parte object to populate the form  more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
    editButton.addEventListener('click', function () {
        openEditModal(parte);
    });
    editButton.textContent = 'Edit';

    // Delete button
    let deleteButton = document.createElement('button');
    deleteButton.className = "actions__btn";

    // Add event on delete button and pass parte id to delete it form server more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
    deleteButton.addEventListener('click', function () {
        deleteParteFromServer(parte.id);
    });
    deleteButton.textContent = 'Sterge';

    // Buttons container
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = "actions__container";
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);



    // Append all parte nodes to container
    let parteListNode = document.createElement('parte');
    parteListNode.appendChild(addButtonContainer);
    parteListNode.appendChild(buttonsContainer);
    parteListNode.appendChild(infoContainer);
    return parteListNode;
}

function createParteDOMNodes(parte) {

    // Nume
    let nume = document.createElement('h2');
    nume.className = "nume";
    nume.textContent = parte.nume;

    // Pret
    let pret = document.createElement('li');
    pret.className = "pret";
    pret.textContent = parte.pret;

    // Data
    let data = document.createElement('li');
    data.className = "data";
    data.textContent = parte.data;

    // Magazin
    let magazin = document.createElement('li');
    magazin.className = "magazin";
    magazin.textContent = parte.magazin;

    // Poza
    let poza = document.createElement('img');
    poza.className = "poza";
    poza.src = parte.poza;

    // Information container
    let infoContainer = document.createElement('ul');
    infoContainer.className = "info__container";
    infoContainer.appendChild(nume);
    infoContainer.appendChild(pret);
    infoContainer.appendChild(data);
    infoContainer.appendChild(magazin);
    infoContainer.appendChild(poza);

    // Append all parte nodes to container
    let parteListNode = document.createElement('parte');
    parteListNode.appendChild(infoContainer);
    return parteListNode;
}

function createContactDOMNodes() {

    addButtonContainer.className = "nimic";
    // Title
    let title = document.createElement('h2');
    title.className = "title title--spaced";
    localStorage.title = 'Noi suntem FutureBuild';
    title.textContent = localStorage.title;

    // Paragraph
    let paragraph1 = document.createElement('p');
    paragraph1.className = "paragraf-contact";
    paragraph1.textContent = "Telefon: 07XX-XXX-XXX";

    let paragraph2 = document.createElement('p');
    paragraph2.className = "paragraf-contact"
    paragraph2.textContent = "Adresa: Str. _____ Nr. 0, __________ ";

    let paragraph3 = document.createElement('p');
    paragraph3.className = "paragraf-contact"
    paragraph3.textContent = "E-MAIL: student@s.unibuc.ro";

    // Paragraph container
    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "content__container";
    paragraphContainer.appendChild(paragraph1);
    paragraphContainer.appendChild(paragraph2);
    paragraphContainer.appendChild(paragraph3);

    // Append all parte nodes to container
    let parteNode = document.createElement('parte');
    parteNode.appendChild(title);
    parteNode.appendChild(paragraphContainer);
    return parteNode;
}


// Append DOM object them to DOM
function renderPartiListPage(parti) {

    removeOldPartiFromDOM();

    // Create and append tags
    for (let i = 0; i < parti.length; i++) {
        let parteDOMNode = createParteListDOMNodes(parti[i]);
        main.appendChild(parteDOMNode);
    }

}

function renderPartePage(parte) {
    removeOldPartiFromDOM();

    // Create and append tags
    let parteDOMNode = createParteDOMNodes(parte);
    main.appendChild(parteDOMNode);

}

function renderContactPage() {
    removeOldPartiFromDOM();

    // Create and append tags
    let contactDOMNode = createContactDOMNodes();
    main.appendChild(contactDOMNode);
}


// Reset form values
function resetForm() {
    formNume.value = '';
    formPoza.value = '';
    formPret.value = '';
    formData.value = '';
    formMagazin.value = '';
}

//  Remove Save Button to clear events more at https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function clearSaveButtonEvents() {
    let newUpdateButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newUpdateButton, saveButton);
    saveButton = document.getElementById('save');
}

// Close modal
function closeModal() {
    body.className = '';
}

// Add event listener on Cancel button
cancelButton.addEventListener('click', closeModal);

listaLink.addEventListener('click', getPartiFromServer);
contactLink.addEventListener('click', renderContactPage);

// Get all articles
getPartiFromServer();