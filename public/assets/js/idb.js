// create variable that will store the connected database object when the connection is complete

let db;

// establish a connection to IndexedDB database called 'pizza-hunt' and set it to version 1
// request variable to act as an event listener for the database -> created when we open the connection to the db using indexedDB.open()
// indexedDB is a global variable
// .open() takes on the following parameters: 
// the name of the indexedDB database you would like to create, if it doesn't exist or connect to if it does
// the version of the db, by default will start at 1, this parameter is used to determine whether the db's structure has changed between connections
const request = indexedDB.open('pizza_hunt', 1);

// Event Listener
// this event will emit if the db version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
    // when the even executes, we store a locally scoped connection to the db and use createObjectStore to create the object store
    db.createObjectStore('new_pizza', { autoIncrement: true }); // autoIncrement for each new set of data we insert
}; // this event listenter will handle the event of a change that needs to be made to the db's structure

// Upon a Successful -> finalize the connection to the db
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply est.
    db = event.target.result;

    // check if app is online, is yes run uploadPizza() function to send all local db data to api
    if (navigator.online) {
        uploadPizza();
    }
};

request.onerror = function(event) { // onerror event handler to inform if anything ever goes wrong with the db interaction
    //log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza
// This function will be used in the add-pizza.js files form submission function if the fecth() function & catch() method is executed
function saveRecord(record) {
    // open a new transaction with the db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    // open a transaction  on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll(); // getall() is asycnchronous function that we have to attach to an
                                              // event handler in order to retrieve the data

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if(serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}
// listen for app coming back online
window.addEventListener('online', uploadPizza);