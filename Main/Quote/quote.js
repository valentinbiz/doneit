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
  const proxyUrl = "https://obscure-wave-23702.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    authorText.innerText = data.quoteAuthor;
    quoteText.innerText = data.quoteText;
    if (data.quoteText.length > 200) {
      getQuote();
    }
    complete();
  } catch (error) {
    getQuote();
  }
}

getQuote();
// loading()
