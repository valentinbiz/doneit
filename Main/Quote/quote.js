const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const loader = document.getElementById("loader");

function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function complete() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

async function getQuote() {
  loading();
  const apiUrl =
    "https://stoic-server.herokuapp.com/random?method=getQuote&lang=en&format=json";
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    authorText.innerText = data[0].author;
    quoteText.innerText = data[0].body;
    console.log(data[0].body);
    if (data[0].body.length > 200) {
      getQuote();
    }
    complete();
  } catch (error) {
    getQuote();
  }
}

getQuote();
// loading()
