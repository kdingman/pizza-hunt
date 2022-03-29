const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go here as methods
    // these methods will be used as callback functions for express.js, each will take 2 params req, res

    // get ALL pizzas -> callback function for GET /api/pizzas, uses Mongoose .find() method
    getAllPizza(req, res) {
        Pizza.find({}) // find() is .findAll() in Sequelize
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get ONE pizza by ID -> uses Mongoose .findOne() to find single pizza by _id, 
    getPizzaById({ params }, res) { // destructured params out of it as that is the only data we need for this request
        Pizza.findOne({ _id: params.id })
        .then(dbPizzaData => {
            // If NO pizza is found, send 404
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Create a Pizza
    createPizza({ body }, res) {
        Pizza.create(body) // destructure the body out of the express.js req object, don't need to interface w/ any other data it provides
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // Update pizza by ID -> PUT /api/pizzas/:id - Mongoose finds a single doc we want to update, updates it, then returns updated doc
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id}, body, { new: true }) // new:true will return updated doc true = new doc, nothing = original doc
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // DELETE Pizza -> DELETE /api/pizzas/:id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id }) // find the doc to be returned and delete it from the database
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;