
// ------------------- game plan ------------------
// GET '/' Displays all of the otters. *****
// GET '/otters/:id' Displays information about one otters. *****
// GET '/otters/new' Displays a form for making a new otters. *****
// POST '/otters' Should be the action attribute for the form in the above route (GET '/otters/new'). *****
// GET '/otters/:id/edit' Should show a form to edit an existing otters. *****
// POST '/otters/:id' Should be the action attribute for the form in the above route (GET '/otters/:id/edit'). *****
// POST '/otters/:id/destroy' Should delete the otters from the database by ID. *****
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
var OtterSchema = new mongoose.Schema({
	name: {type: String},
	type: {type: String},
	food: {type: String},
	age : {type: Number}
})

mongoose.model('Otter',OtterSchema);
var Otter = mongoose.model('Otter')

// --------------- first page ------------------------------------------
app.get('/', function( req, res) {
	Otter.find( {}, function (err, otters) {

		// console.log(otters);
		res.render('index', { otter : otters } );

	})
})

// ---------------------display add new otter page --------------
app.get('/otters/new', function( req, res) {

	res.render('addnew')

})


// ----------------display otter by ID ----------------------------------
app.get('/otters/:id' , function ( req, res) {
	console.log(req.params.id)
	Otter.findOne( { _id : req.params.id }, function (err, that_otter ) {
		if (err) {
			console.log('oops! something went wrong!')
			console.log(err)
		}else{ 
			console.log(req.params.id)
			console.log(that_otter);
			res.render('that_otter' , { that_otter : that_otter });
		}
	})
})

//----------------adding new otter -------------------------------
app.post('/otters', function( req,res) {
	var otter = new Otter( {name: req.body.name, type: req.body.type, food: req.body.food , age: req.body.age});
	otter.save(function (err) {
		if(err) {
			console.log('something went wrong!');
		}else{
			console.log('successfuly added a new otter!')
			res.redirect('/')
		}
	})
})

// --------------- display editing page for individual otter ----------------------
app.get('/otters/:id/edit', function ( req , res) {
	Otter.findOne( { _id : req.params.id }, function (err, that_otter ) {

		console.log(req.params.id)
		console.log(that_otter);
		res.render('edit_the_otter', { the_id : req.params.id });

	})
})

// ----------------- edit individual otter information ------------------
app.post('/otters/:id', function ( req, res) {
	Otter.findOne({ _id : req.params.id }, function (err, edit_otter ) {

		console.log(req.params.id);
		console.log(edit_otter);
		console.log(edit_otter.name);

		if(req.body.edit_name) {
			edit_otter.name = req.body.edit_name
		}else{

		};

		if(req.body.edit_type) {
			edit_otter.type = req.body.edit_type
		}else{

		};

		if(req.body.edit_age) {
			edit_otter.age = req.body.edit_age
		}else{

		};

		if(req.body.edit_food) {
			edit_otter.food = req.body.edit_food
		}else{

		};

		edit_otter.save(function (err) {
			
			if(err) {
				console.log('oh no! something went wrong!')
			}else{
				res.redirect('/')
			}
		})
	})
})

//--------------------delete an otter -----------------
app.post('/otters/:id/delete', function ( req, res) {
	Otter.remove({ _id : req.params.id }, function (err) {
		if(err) {
			console.log(err);
		}else{
			res.redirect('/')
		}
	})
})
		
// ************************ routing ****************************************

app.listen(8000, function() {

	console.log("listening on port 8000");

})

