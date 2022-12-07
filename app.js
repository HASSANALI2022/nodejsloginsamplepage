//jshing esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//const mailchimp =require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// HOME PAGE
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
// Required data for storage in database
const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME : firstName,
        LNAME : lastName
      }
    }
    ]
  };
  // Turn data into a string sendto mailchimp.
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/2b9da8ca24";
  const options = {
    method : "POST",
    auth : "Zeeshan77:a8a5f95db4b818a9aa5d9580ed10d849-us21"
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode ===200){
      res.sendFile(__dirname + "/success.html");
    }else {
      {
        res.sendFile(__dirname + "/failure.html");
      }
    }

  response.on ("data",function(data){
  console.log(JSON.parse(data));
  })
  })
  request.write(jsonData);
  request.end();
});
//Function work after failure to redirect Home page

app.post("/failure", function(req, res){
  res.redirect("/");
});

//api key : 1965988c5f892e6bb8398471ac41dd8f-us21
// unique list id : 2b9da8ca24
app.listen(3000,function(){
    console.log("Server port 3000 is ready");
  });
