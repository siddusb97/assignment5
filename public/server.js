var express = require("express");
var fs=require("fs");
var path = require("path");
var app = express();

var multiparty = require('multiparty');
var util=require('util');



app.use(express.static(path.join((__dirname,"public"))));



app.get('/index.html', function(req,res){
      res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/getJsonFile', function(req,res){
      var content = JSON.parse(fs.readFileSync(__dirname +"/json/bk.json"));

      res.send(content, null, 4);

})

app.get('/deleteMovie', function(req,res){
      var content=readFileJson(__dirname +"/json/bk.json",req.param("title"));

      updateMovieDetails(__dirname +"/json/bk.json",content);

      res.redirect( "/index.html" );
})

app.post('/addNew', function(req,res){

    console.log("ADDateDetails");
    var form=new multiparty.Form();
    form.parse(req, function (err, fields, files) {

    fs.readFile(files.poster[0].path, function (err, data) {
  // ...
    var newPath = __dirname + "/images/"+fields.title[0]+".jpg";
    fs.writeFile(newPath, data, function (err) {

  });
});

    var content=JSON.parse(fs.readFileSync(__dirname + '/' +'bk.json'));

    var obj=mapElements(fields,files);
    content.push(obj);
    updateMovieDetails(__dirname + '/' +'bk.json',content);
});
    res.redirect( "/index.html" );

})

app.post('/updateDetails',function(req,res){
      console.log("updateDetails");
      var form=new multiparty.Form();
      form.parse(req, function (err, fields, files) {

      fs.readFile(files.poster[0].path, function (err, data) {
        // ...
      var newPath = __dirname + "/images/"+fields.title[0]+".jpg";
      fs.writeFile(newPath, data, function (err) {

      });
  });

      var content=readFileJson(__dirname + '/bk.json',fields.title[0]);

      var obj=mapElements(fields,files);


      content.push(obj);

      updateMovieDetails(__dirname + '/' +'bk.json',content);

});
      res.redirect( "/index.html" );

})
app.listen(8080);


function readFileJson(filePath,req){
    var content=JSON.parse(fs.readFileSync(filePath));
    for(var index=0;index<content.length;index++){
      if(content[index].Title === req){
        console.log("hi");
        content.splice(index,1);
      }
}
  return content;
}

function updateMovieDetails(filePath,content){
    fs.writeFile(filePath, JSON.stringify(content, null, 4), function(err) {
          if(err) {
            console.log(err);
           }
  });
}

function mapElements(fields,files){
    var obj={};
    obj.Title=fields.title[0];
    obj.Year=fields.year[0];
    obj.Released=fields.released[0];
    obj.Director=fields.director[0];
    obj.Actors=fields.actors[0];
    obj.Plot=fields.plot[0];
    obj.Language=fields.language[0];
    obj.Country=fields.country[0];
    obj.Awards=fields.awards[0];
    obj.Poster="/images/"+fields.title[0]+".jpg";
    obj.Rating=fields.rating[0];
  return obj;
}
