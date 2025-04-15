document.addEventListener("DOMContentLoaded", () => {
    displayStocks([]);
  });
        

const searchButton = document.getElementById("search-button");
let updateInterval;
let stocks = [];


fetchStocks("AAPL");
fetchStocks("GOOGL");
fetchStocks("MSFT");
fetchStocks("AMZN");
document.getElementById("logout").addEventListener("click", logout);

function fetchStocks(symbol, isUpdate = false) {
  if (!symbol) return;

  const apiKey = "cv3ivs9r01ql2eurkv7gcv3ivs9r01ql2eurkv80";
  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;

  Promise.all([fetch(quoteUrl), fetch(profileUrl)])
    .then((responses) => {
      if (responses.some((response) => !response.ok)) {
        throw new Error("Invalid symbol or error fetching data");
      }
      return Promise.all(responses.map((response) => response.json()));
    })
    .then((data) => {
      const quoteData = data[0];
      const profileData = data[1];
      if (!quoteData.c || !profileData.name) {
        throw new Error("Invalid symbol or error fetching data");
      }
      const stockData = [
        {
          name: profileData.name,
          price: quoteData.c,
          change: (((quoteData.c - quoteData.o) / quoteData.o) * 100).toFixed(
            2
          ),
          marketCap: profileData.marketCapitalization || "N/A",
          symbol: symbol,
        },
      ];
      displayStocks(stockData, isUpdate);
    })
    .catch((error) => {
      if (!isUpdate) {
        showToast("Failed to fetch data for symbol: " + symbol);
      }
      console.error(error);
    });
}

function displayStocks(stock, isUpdate = false) {
  const stocksList = document.getElementById("stock-info");
  const input = document.getElementById("stock-search");

  if (stock.length > 0) {
    const stockSymbol = stock[0].symbol;
    const existingIndex = stocks.findIndex(
      (existing) => existing.symbol === stockSymbol
    );

    if (existingIndex !== -1) {
      if (isUpdate) {
        const stockDiv = document.getElementById(stockSymbol);
        if (stockDiv) {
          stockDiv.querySelector(
            "li"
          ).textContent = `${stock[0].name} - $${stock[0].price}`;
          stocks[existingIndex].price = stock[0].price;
        }
      } else {
        alert(`Stock ${stock[0].name} is already in the list`);
        showToast(`Stock ${stock[0].name} is already in the list`);
      }
    } else {
      const div = document.createElement("div");
      div.classList.add("stock-container");
      div.id = stockSymbol;
      const button = document.createElement("button");
      button.innerHTML = "<button>Buy</button>"
      button.addEventListener("click", buyStocks);
      div.innerHTML = `
    <li class="stock">${stock[0].name} - $${stock[0].price}</li>
    <li class="stock">Change: ${stock[0].change}%</li>
`;
    div.appendChild(button);
      

      stocksList.appendChild(div);

      stocks.push(stock[0]);

      if (!updateInterval) {
        updateInterval = setInterval(updateStockPrices, 30000);
      }
    }

    if (input) input.value = "";
  }
}

function updateStockPrices() {
  stocks.forEach((stock) => {
    fetchStocks(stock.symbol, true);
  });
}

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const symbol = document.getElementById("stock-search").value.toUpperCase();
  if (!symbol) return;
  fetchStocks(symbol);
});

function buyStocks(){
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please log in to buy stocks.");
        return;
    }
    const stockSymbol = this.parentElement.id;        
    const price = stocks.find(stock => stock.symbol === this.parentElement.id).price;
    console.log(price);
    
    fetch(`https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app/${user.uid}/BoughtStocks.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockSymbol: stockSymbol,
          price: price,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Stock bought successfully:", data);
      })
      .catch((error) => {
        console.error("Error buying stock:", error);
      });
    
    
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../HomePage/home.html";
}
