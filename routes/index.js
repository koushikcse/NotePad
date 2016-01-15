var express = require('express');

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/notePad");

var notePadSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
});

var notePadModel = mongoose.model('notePadSchema', notePadSchema);

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("NO.");
});

router.route('/notes')
    .get(function(req, res, next) {
        notePadModel.find(function(err, notes) {
            if (err) {
                // next(err);
                res.sendStatus(500);
            }
            res.send(notes);
        });
    })
    .post(function(req, res, next) {
        var newNote = new notePadModel({
            name: req.body.name,
            text: req.body.text,
            date: req.body.date
        });
        newNote.save(function(err, note) {
            if (err) {
                // next(err);
                res.sendStatus(500);
            } else {
                res.send(note);
            }
        });
    })
    .put(function(req, res, next) {
        notePadModel.findOneAndUpdate({
            _id: req.body._id
        }, req.body, function(err, note) {
            if (err) {
                // next(err);
                res.sendStatus(500);
            }
            res.send(note);
        });
    })
    .delete(function(req, res, next) {
        notePadModel.findOneAndRemove({
            _id: req.body._id
        }, function(err, note) {
            if (err) {
                // next(err);
                res.sendStatus(500);
            }
            res.send(note);
        })
    });

module.exports = router;
