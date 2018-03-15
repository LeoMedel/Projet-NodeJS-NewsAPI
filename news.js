
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('2c37a302a5334dc7b941ad4655a5c16e');

var dataSource;
var dataArticles;

newsapi.articles({
  source: 'associated-press', // required
  sortBy: 'top' // optional
}).then(articlesResponse => {
  console.log("TOTO articles : "+articlesResponse);
  //console.log(articlesResponse.articles[0]);
  dataArticles = articlesResponse;
});



// To query sources:
newsapi.sources({
  //category: 'technology', // optional
  language: 'en', // optional
  country: 'us' // optional
}).then(sourcesResponse => {
  
  console.log("TOTO sources : "+ sourcesResponse);
  //console.log(sourcesResponse.sources[0]);
  dataSource = sourcesResponse;

});


var creeAr = module.exports.creeAr = function creeArticles()
  {
    console.log("Function Articles");
    var html = "";
    console.log("Nombre d'articles : "+dataArticles.articles.length);
    for(var i =0; i < dataArticles.articles.length; i++){
      
      html +=   "<br></br>"+
                "<div class='border-top bg-secondary text-white'>"+
                  "<h1 class='text-dark text-center font-italic'>\""+ dataArticles.articles[i].title +"\"</h2>"+
                  "<img mw-100 class='rounded' src='"+ dataArticles.articles[i].urlToImage +"' width='700' height='600'>"+
                  "<p class='text-left font-italic'>By: "+ dataArticles.articles[i].author +"</p>"+
                  "<p class='text-right'>"+ dataArticles.articles[i].publishedAt +"</p>"+
                  "<p class='text-justify'>"+ dataArticles.articles[i].description +"</p>"+
                  "<a class='text-dark' href='"+ dataArticles.articles[i].url +"'><p class='text-right'>Voir l'article</p></a>"+
                  
                  "<ul class='list-group bg-light text-dark' id='"+i+"'>"+
                    "<li class='list-group-item list-group-item-dark'><h4>Commentaires</h4></a>"+
                  "</ul>"+
                  "<div class='input-group mb-3 bg-light text-dark'>"+
                    "<input type='text' id='textfield_message"+i+"' value='' class='form-control' placeholder='Ecrivez-vous un commentaire' aria-label='Ecrivez-vous un commentaire' aria-describedby='basic-addon2'>"+
                    "<div class='input-group-append'>"+
                      "<button class='btn btn-outline-dark' type='button' onclick=\"sendMessage('"+i+"', 'textfield_message"+i+"')\">Done</button>"+
                    "</div>"+
                  "</div>"+
                "</div>";
    }
    return html;
  }


  var creeSource = module.exports.creeSource = function creeSources()
  {
    var html = "";
    console.log("Function Sources");
    console.log("Nombre d'articles : "+dataSource.sources.length);
    for(var i =0; i < dataSource.sources.length; i++){
      
      html +=   "<h1>"+dataSource.sources[i].country+" : "+ dataSource.sources[i].name +"</h1>"+
                "<h4>"+dataSource.sources[i].category+" ("+dataSource.sources[i].language+")</h4>"+
                "<p>"+ dataSource.sources[i].description +"</p>"+
                "<button onclick='sendMessage()'>Partager</button>"+
                "<a href='"+ dataSource.sources[i].url +"'>Voir l'article</a>";
    }
    return html;
  }
