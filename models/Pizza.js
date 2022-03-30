// Use Schema Constructor, imported Mongoose
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: "Large"
    },
    toppings: [], // array
    comments: [
        {
            type: Schema.Types.ObjectId, // ObjectId is so that mongoose knows to expect a comment
            ref: 'Comment' // ref property tells the Pizza Model which docs to search to find the right comments
        }
    ]
},
{
    toJSON: { // tells the Schema that it can use virtuals
        virtuals: true,
        getters: true,
    },
    id: false // false b/c this is a virtual that mongoose returns and we don't need it.
}
);

// *Virtual Properties* work just like functions. - get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
}); // using reduce() to tally up the total of every comment w/ its reply

// create the Pizza Model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza Model
module.exports = Pizza;