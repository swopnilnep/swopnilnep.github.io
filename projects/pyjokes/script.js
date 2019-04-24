/* jshint esversion: 6 */
/* jshint browser: true */
/* jshint node: true */
"use strict";

async function getData(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}

async function getJoke() {
    let response = await getData("http://swopnilnep.pythonanywhere.com/api/v1/jokes");
    printValue(response.joke, "#response");
}

function printValue(value, divId) {
    let respDiv = document.querySelector(divId);
    respDiv.innerHTML = value;
}
