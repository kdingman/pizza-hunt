const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body}, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: {comments: _id } }, //$push method adds data to an array, $ is built in MongoDB
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    // add reply -> not creating a new document -> just updating an existing comment
    addReply({ params, body}, res) { // passing params as a parameter, pass it to the addReply() in the route
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id.' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId }) // deletes the doc while also returning its data
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id.' });
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId }}, //$pull -> take that data use it to identify and remove it from the associated pizza
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData); // then we return the updated pizza data now w/o the _id of the comment in the comments array
        })
        .catch(err => res.json(err));
    },
    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } }, // $pull operator to remove the specific reply from the replies array
            { new: true }                                        // where the replyId matches the value of params.replyId passed in from the route   
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    }
};

module.exports = commentController;
