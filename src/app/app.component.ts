import { Component } from '@angular/core';
declare var Stripe:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stripe';
}

var handleFetchResult = function(result) {
  if (!result.ok) {
    return result.json().then(function(json) {
      if (json.error && json.error.message) {
        throw new Error(result.url + ' ' + result.status + ' ' + json.error.message);
      }
    }).catch(function(err) {
      showErrorMessage(err);
      throw err;
    });
  }
  return result.json();
};

// Create a Checkout Session with the selected plan ID
var createCheckoutSession = function(priceId) {
  return fetch("http://127.0.0.1:8000/api/v1/sesion-stripe/", {
    method: "POST",
    headers: {
      'X-CSRFToken': 'ffsfaskhgfajshgf',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIwMzY2NzE5LCJqdGkiOiIwZTJjZGI2OTU2MjQ0ODQyOWNkODRjNjI0M2ExMzllNSIsInVzZXJfaWQiOjE2fQ.Otxo_gGJuE9krtEZhTu2TgU2UwxvYRSXlV_g3uanDJ4'
    },
    body: JSON.stringify({
      priceId: priceId
    })
  }).then(handleFetchResult);
};

// Handle any errors returned from Checkout
var handleResult = function(result) {
  if (result.error) {
    showErrorMessage(result.error.message);
  }
};

var showErrorMessage = function(message) {
  var errorEl = document.getElementById("error-message")
  errorEl.textContent = message;
  errorEl.style.display = "block";
};

/* Get your Stripe publishable key to initialize Stripe.js */
fetch("http://127.0.0.1:8000/api/v1/setup/", {
        method: 'GET',
        headers: new Headers({
          'X-CSRFToken': 'ffsfaskhgfajshgf',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        })
        
    })
  .then(handleFetchResult)
  .then(function(json) {
    console.log(json)
    var publishableKey = json.publishableKey;
    var basicPriceId = json.basicPrice;
    var proPriceId = json.proPrice;

    var stripe = Stripe(publishableKey);
    // Setup event handler to create a Checkout Session when button is clicked
    document
      .getElementById("basic-plan-btn")
      .addEventListener("click", function(evt) {
        createCheckoutSession(basicPriceId).then(function(data) {
          // Call Stripe.js method to redirect to the new Checkout page
          stripe
            .redirectToCheckout({
              sessionId: data.sessionId
            })
            .then(handleResult);
        });
      });

    // Setup event handler to create a Checkout Session when button is clicked
    document
      .getElementById("pro-plan-btn")
      .addEventListener("click", function(evt) {
        createCheckoutSession(proPriceId).then(function(data) {
          // Call Stripe.js method to redirect to the new Checkout page
          stripe
            .redirectToCheckout({
              sessionId: data.sessionId
            })
            .then(handleResult);
        });
      });
  });


