const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));


mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB" , {useNewUrlParser:true}).then(() => console.log('Connected!'));

const articlesSchema = {
  title:String,
  content:String
};

const Articles = mongoose.model("articles", articlesSchema) 

app.route("/articles/:articleTitle")

.get(function(req, res) {

    Articles.findOne({title:req.params.articleTitle},function(err,results) {
        if (results) {
            res.send(results)
        } else{ 
            res.send("No articles matching that title was found.")
        }
})})

.put(function(req, res) {

    Articles.replaceOne(
        {title: req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        function(err,docs){
            if(!err){
                console.log("success")
            } else
            console.log(err);
        }
)})

.patch(function(req,res){

    Articles.updateOne(
        {title: req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                console.log("success")
            } else
            console.log(err);
        }
)})

.delete(function(req,res) {
    Articles.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                console.log("successfully deleted")
            } else
            console.log(err);
        }
    )
})


app.route("/articles").get(function(req, res){
    Articles.find(function(err,results) {
        if (!err) {
            res.send(results)
        } else{
            res.send(err)
        }

    })}).post(function(req,res) {
        const newEntry = new Articles({
            title:req.body.title,
            content:req.body.content
        });
        console.log("success")
        newEntry.save(function(err) {
            if(!err){
                res.send("Succesfully added a new article.")
        } else{
            res.send(err)
        }})
    }).delete(function(req,res) {
        Articles.deleteMany(function(err){
            if(!err) {
                res.send("Succesully deleted all records");
            } else {
                res.send(err);
            }
        })
    })

// app.get("/articles", function(req, res){
//     Articles.find(function(err,results) {
//         if (!err) {
//             res.send(results)
//         } else{
//             res.send(err)
//         }

//     })
// })

// app.post("/articles", function(req,res) {
//     const newEntry = new Articles({
//         title:req.body.title,
//         content:req.body.content
//     });
//     console.log("success")
//     newEntry.save(function(err) {
//         if(!err){
//             res.send("Succesfully added a new article.")
//     } else{
//         res.send(err)
//     }})
// });

// app.delete("/articles", function(req,res) {
//     Articles.deleteMany(function(err){
//         if(!err) {
//             res.send("succesully deleted all records");
//         } else {
//             res.send(err);
//         }
//     })
// })

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  