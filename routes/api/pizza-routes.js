const router = require('express').Router();

    // Instead of importing the entire object pizzaController.getAllPizza() - simply destructure the method names out of the imported
    // object and use those names directly
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');


// Set up GET all and POST at /api/pizzas
// implement the destructured names and implement them directly into the routes -> name of the controller method as the callback
router
    .route('/')
    .get(getAllPizza)
    .post(createPizza);

// Set up GET one, PUT and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;