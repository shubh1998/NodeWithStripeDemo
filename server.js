const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.listen(3000, () => {
  console.log("Server started....");
});

//congigure view engine :Hbs
var path = require("path");
app.set("views", path.join(__dirname, "views")); //location
app.set("view engine", "hbs"); //extension

var stripe = require("stripe")("sk_test_8aa4fApuBmtTLFXZDfMhkOza00wgcZqGN7");

//configure body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.render("first");
});

app.post("/pay", (request, response) => {
  var token = request.body.stripeToken;
  var chargeamt = request.body.amount;
  var charge = stripe.charges.create(
    {
      amount: chargeamt,
      currency: "inr",
      source: token
    },
    (err, result) => {
      if (err & (err.type === "StripeCardError")) {
        console.log("Card Decliend");
      }
      response.redirect("/done");
    }
  );
});

app.get("/done", (request, response) => {
  response.render("success");
});
