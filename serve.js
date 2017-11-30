const bodyParser = require("body-parser");
const express = require("express");
const app = express();

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "cris",
    password: "pass",
    database: "nodejs"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected1!");
});

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.get('/object',(req,res)=>{
    //res.writeHead(200,{"Context-Type":"text/plain"});
    //res.write("get page");
res.sendFile(`${__dirname}/object.html`);
    //res.end();

    console.log('get')
})

app.get('/object/mykey',(req,res)=>{
    console.log(req.query.timestamp)

    var timestamp=req.query.timestamp==undefined?null:req.query.timestamp;
    var sql = "SELECT * FROM nodejs.object WHERE ("+timestamp+" IS NULL OR timestamp<"+timestamp+") ORDER BY id DESC LIMIT 1";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var string=JSON.stringify(result);
        var json =  JSON.parse(string);
        return res.json({ "key":"mykey", "value":json[0].value, "timestamp":json[0].timestamp });
    });


})

app.post('/object',(req,res)=>{
    var value=req.body.mykey;
    var time = parseInt(Date.now()/1000);
    var sql = "INSERT INTO object (value, timestamp) VALUES ('"+value+"', "+time+")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    return res.json({ "key":"mykey", "value":value, "timestamp": time });
})

app.listen(3000,()=>{
    console.log("Started on http://localhost:3000");
})