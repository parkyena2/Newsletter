const express = require("express");
const app = express();

const https = require("https");

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/b7d1de628a";

  const options = {
    method: "post",
    auth: "yena:67114aecd046506600b723b56435effd-us20"
  }

  const request = https.request(url, options, function(response) {
    
    if(response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server in running on port 3000");
});

//mailChimp API key
//67114aecd046506600b723b56435effd-us20
//audience id, list id
//b7d1de628a