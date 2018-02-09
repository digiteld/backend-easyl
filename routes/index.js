var express = require('express');
var router = express.Router();
var db = require('../queries');
var User = require('../models/user');

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.status(401)
	    .json({
	      status: 'Unauthorized',
	      message: 'Utilisateur non authentifié'
	    });
    }    
};


router.get('/api/restaurants',sessionChecker, db.getAllRestaurants);
router.get('/api/restaurants/:id',sessionChecker, db.getSingleRestaurant);
router.post('/api/restaurants',sessionChecker, db.createRestaurant);
router.put('/api/restaurants/:id',sessionChecker, db.updateRestaurant);
router.delete('/api/restaurants/:id',sessionChecker, db.removeRestaurant);

router.get('/api/booking',sessionChecker, db.getAllBookings);
router.get('/api/booking/:id',sessionChecker, db.getSingleBooking);
router.post('/api/booking',sessionChecker, db.createBooking);
router.put('/api/booking/:id',sessionChecker, db.updateBooking);
router.delete('/api/booking/:id',sessionChecker, db.removeBooking);

router.get('/api/command',sessionChecker, db.getAllCommands);
router.get('/api/command/:id',sessionChecker, db.getSingleCommand);
router.post('/api/command',sessionChecker, db.createCommand);
router.put('/api/command/:id',sessionChecker, db.updateCommand);
router.delete('/api/command/:id',sessionChecker, db.removeCommand);

router.get('/api/meal',sessionChecker, db.getAllMeals);
router.get('/api/meal/:id',sessionChecker, db.getSingleMeal);
router.post('/api/meal',sessionChecker, db.createMeal);
router.put('/api/meal/:id',sessionChecker, db.updateMeal);
router.delete('/api/meal/:id',sessionChecker, db.removeMeal);

router.get('/api/payment',sessionChecker, db.getAllPayments);
router.get('/api/payment/:id',sessionChecker, db.getSinglePayment);
router.post('/api/payment', sessionChecker,db.createPayment);
router.put('/api/payment/:id', sessionChecker,db.updatePayment);
router.delete('/api/payment/:id',sessionChecker, db.removePayment);

// Authentification--------------------------------------------------------------------------

// route for Home-Page
router.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});



//route for user signup
router.post('/signup',(req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.status(200)
			    .json({
			      status: 'OK',
			      message: 'Utilisateur créé et authentifié'
			});
        })
        .catch(error => {
        	console.log(error)
            res.status(500)
			    .json({
			      status: 'KO',
			      message: 'Erreur serveur'
			});
        });
    }
);

router.post('/login',
	(req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            
            if (!user) {
                //res.redirect('/login');
                res.status(401)
			    .json({
			      status: 'Unauthorized',
			      message: 'Utilisateur non authentifié'
			    });
            } else if (!user.validPassword(password)) {
                res.status(401)
			    .json({
			      status: 'Unauthorized',
			      message: 'Utilisateur non authentifié'
			    });
            } else {
                req.session.user = user.dataValues;
                res.status(200)
			    .json({
			      status: 'OK',
			      message: 'Utilisateur authentifié'
			    });
            }
        });
    }
);

router.get('/logout',(req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.status(200)
			    .json({
			      status: 'OK',
			      message: 'Déconnection OK'
			    });
    } else {
        res.status(500)
        .json({
			status: 'erreur',
			message: 'Déconnection KO'
		});;
    }
});


// application -------------------------------------------------------------
router.get('/', function (req, res) {

    res.render('index', {title: 'node-postgres-promises'}); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;
