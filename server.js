
// ------------------- game plan ------------------
// GET '/' for main page with form to input your name and quote
// POST '/quotes' for the method of the form to make a new quote
// GET'/quotes' for all the quotes to be rendered
//-------------------- end plan -------------------

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basic_mongoose')

app.use(bodyParser.urlencoded({ extended: true}));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// -------------------mongodb stuff goes here ---------------------
var QuoteSchema = new mongoose.Schema({
	name: {type: String},
	quote: {type: String},
	created_at: {type: Date, default: Date.now() }
})

mongoose.model('Quote',QuoteSchema);
var Quote = mongoose.model('Quote')

// --------------- first page ------------------------------------------
app.get('/', function( req, res) {
	
		res.render('addnew');

	})

// ---------------------display quotes page --------------
app.get('/quotes', function( req, res) {
	Quote.find( {} , function ( err, quotes) {

		if (err) {
			console.log('oh no!!! ')
		}else{
			res.render('quotes', {quote : quotes})
		}

	})
})


// ----------------add my quote ----------------------------------
app.post('/quotes', function( req,res) {
	if (req.body.name && req.body.quote) {
		var quote = new Quote( {name: req.body.name, quote: req.body.quote });
		quote.save(function (err) {
			if(err) {
				console.log('something went wrong!');
			}else{
				console.log('successfuly added a new quote!')
				res.redirect('/quotes')
			}
		})
	}	
})



		
// ************************ routing ****************************************

app.listen(8000, function() {

	console.log("listening on port 8000");

})

