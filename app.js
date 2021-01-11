//require terminal installation
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});
const mysql = require ('mysql');
const sql = mysql.createConnection ({
    host:'localhost',
    user:'root',
    password:'5nAhxsyb3L^,Nze',
    port:3306,
    //insecureAuth : true
});

sql.query("use nodejs");
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

//template engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//routes && templates .get  .put  .post
app.post("/controllerForm", urlencodeParser, function (req,res){
    sql.query("insert into user values(?,?,?,?)", [req.body.id, req.body.name, req.body.email, req.body.empresa]);
    res.render('controllerForm', {name:req.body.name});
});

app.get("/inserir/:id?", function (req,res) {
    res.render("inserir");
});

app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from user order by id asc",function(err,results,fields){
           res.render('select',{data:results});
        });
    }else{
        sql.query("select * from user where id=? order by id asc",[req.params.id],function(err,results,fields){
            res.render('select',{data:results});
        });
    }
});

app.get("/", function (req, res){
    //res.send("HOMEPAGE!");
    //res.sendFile(__dirname+"/index.html");
    res.render('index');
})

app.get('/deletar/:id',function(req,res){
    sql.query("delete from user where id=?",[req.params.id]);
    res.render('deletar');
});

app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id, name:results[0].name, email:results[0].email});
    });
});
app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update user set name=?,email=? where id=?",[req.body.name, req.body.email, req.body.id]);
   res.render('controllerUpdate');
});


//start server
app.listen(3000, function (req, res){
    console.log('SERVER IS ALIVE!')
})