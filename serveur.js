
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();
var server = http.createServer(app);
var cookieParser = require('cookie-parser');
var session = require('express-session');

var usersConnecte = [];

//set the view engine to ejs
app.set('view engine', 'ejs');



// on r�cup�re la bibliotheque qui permet de
// manipuler des urls
var url = require('url');
var querystring = require('querystring');
//Variable pour utiliser l'API News API
var articles = require("./news");

//active le module cookieParser dans Express
app.use(cookieParser());

// active le module de gestion des sessions dans Express
// l'option secret permet de s�curiser le cookie
app.use(session({secret: '1234567890QWERTY'}));

app.use(express.static(__dirname ));


app.get('/', function(req, res) {
  
  res.render('accueil.ejs', {
    title : 'Login',

  });
});

app.get('/accueil', function(req, res){
	res.render('accueil.ejs', {
		title : 'Login'
	});
});


app.get('/index', function(req, res) {
// on r�cup�re les param�tres depuis l'url de la requ�te
var params = querystring.parse(url.parse(req.url).query);

console.log("SALUT : " + params.username);

	var html = articles.creeAr();
  
  res.render('index.ejs', {
    title : 'News API',
    title : 'Menu '+ params.username,
	username: params.username,
    html,
    usersConnecte, 
    nombreUsers: usersConnecte.length

  });
});



//Chargement de socket.io
var io = require('socket.io').listen(server);

//Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function(socket){
	console.log('Un client est connect� !');

	// Quand un client se connecte, on lui envoie un message
	socket.emit('message', 'Vous etes bien connecte !');

	//D�s qu'on nous donne un pseudo, on le stocke en variable de session
	socket.on('petit_nouveau', function(pseudo) {
		socket.pseudo = pseudo;

		session.user = pseudo;
		console.log(session.user + " est connect�...!!!");

		//On ajoute au nouveau user
		usersConnecte.push(session.user);
		console.log(" USERS CONNECTES  -> "+usersConnecte);

		//On signale aux autres clients qu'il y a un nouveau venu
		socket.broadcast.emit('message', session.user+' vient de se connecter :D ');

	});



	socket.on('disconnect', function() {
		console.log("Deconnection !!!");
	});

	socket.on('aurevoir', function(userDex) {
		console.log("Au revoir !!!"+ userDex);
		usersConnecte.splice(usersConnecte.indexOf(userDex), 1)
		socket.broadcast.emit('message', userDex+' se deconnect�');
    	socket.emit('disconnect');
    	
	});

	
	// D�s qu'on re�oit un "message" (clic sur le bouton), on le note dans la console
	socket.on('message', function (message, lis) {
		// On r�cup�re le pseudo de celui qui a cliqu� dans les variables de session
		socket.broadcast.emit('message', socket.pseudo+" : "+ message, lis);
	});

});


server.listen(8080);