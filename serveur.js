
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



// on récupère la bibliotheque qui permet de
// manipuler des urls
var url = require('url');
var querystring = require('querystring');
//Variable pour utiliser l'API News API
var articles = require("./news");

//active le module cookieParser dans Express
app.use(cookieParser());

// active le module de gestion des sessions dans Express
// l'option secret permet de sécuriser le cookie
app.use(session({secret: '1234567890QWERTY'}));

app.use(express.static(__dirname ));


app.get('/', function(req, res) {
  
  res.render('accueil.ejs', {
    title : 'Login',

  });
});


//Chargement de socket.io
var io = require('socket.io').listen(server);

//Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function(socket){
	console.log('Un client est connecté !');

	// Quand un client se connecte, on lui envoie un message
	socket.emit('message', 'Vous etes bien connecte !');
	//usersConnecte.push("toto");
	//var pos = usersConnecte.indexOf('a');
	//usersConnecte.splice(pos, 1);

	//console.log("toto usersConnecte -> "+usersConnecte);

	//Dès qu'on nous donne un pseudo, on le stocke en variable de session
	socket.on('petit_nouveau', function(pseudo) {
		socket.pseudo = pseudo;

		session.user = pseudo;
		console.log(session.user + " est connecté...!!!");
		usersConnecte.push(session.user);
		console.log("toto usersConnecte -> "+usersConnecte);

		//On signale aux autres clients qu'il y a un nouveau venu
		socket.broadcast.emit('message', session.user+' vient de se connecter :D ');
		

	});

	socket.on('recharger', function() {
		
	});

	socket.on('disconnect',function(user)
	{  
		var pos = usersConnecte.indexOf(user);
		usersConnecte.splice(pos, 1);

		socket.broadcast.emit('recharger');

  		socket.disconnect();

  		
	});

	// Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
	socket.on('message', function (message, lis) {
		// On récupère le pseudo de celui qui a cliqué dans les variables de session
		console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
		socket.broadcast.emit('message', socket.pseudo+" : "+ message, lis);
	});

	// Quand le serveur reçoit un signal de type "message" du client
	//socket.on('message', function(message) {
	//console.log('Un client me parle ! Il me dit : \n Prenom:' + message.prenom+ ' Nom:'+message.nom);
	//});
});




app.get('/accueil', function(req, res){
	res.render('accueil.ejs', {
		title : 'Login'
	});
});


app.get('/index', function(req, res) {
// on récupère les paramètres depuis l'url de la requête
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





server.listen(8080);