const user = JSON.parse(localStorage.getItem("user"));
const mainContainer = document.getElementById("card-container");

window.addEventListener("DOMContentLoaded", () => {
  if (user && user.uid) {
    fetch(
      `https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app/${user.uid}/BoughtStocks.json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        for (const key in data) {
          const container = document.createElement("div");
          container.classList.add(
            "bg-slate-700",
            "rounded-xl",
            "flex",
            "flex-col"
          );

          container.innerHTML = `
            <div class="p-8 mx-3 mt-3 rounded-t-xl bg-slate-800 text-white">
                <div class="text-center uppercase">${data[key].stockSymbol}</div>
                <h2 class="mt-10 font-serif text-5xl text-center">Bought at: ${data[key].price}$</h2>
                <h2 class="text-lg mt-2 text-center" id="price-${key}">Current price: Fetching...</h2>
                <h3 class="mt-2 text-center">Quantity: ${data[key].quantity}</h3>
                <div class="flex justify-center">
                  <a id="${key}"
                    href=""
                    class="inline-block px-10 py-3 my-6 text-center border border-violet-600 rounded-lg duration-200 hover:bg-violet-800 hover:border-violet-800"
                    >Sell</a>
                </div>
                <h3 class="mt-2 text-center" id="profit-${key}">Profit: Fetching...</h3>
              </div>
              <div class="h-5 bg-slate-700 rounded-b-xl"></div>
          `;

          mainContainer.appendChild(container);

          function updatePriceAndProfit() {
            fetchStocks(data[key].stockSymbol).then((currentPrice) => {
              const priceElement = document.getElementById(`price-${key}`);
              const profitElement = document.getElementById(`profit-${key}`);
              if (currentPrice !== null) {
                priceElement.textContent = `Current price: $${currentPrice}`;
                const profit =
                  (currentPrice - data[key].price) * data[key].quantity;
                profitElement.textContent = `Profit: $${profit.toFixed(2)}`;
              } else {
                priceElement.textContent = "Failed to fetch price.";
                profitElement.textContent = "Failed to fetch profit.";
              }
            });
          }

          updatePriceAndProfit();
          setInterval(updatePriceAndProfit, 30000);

          document.getElementById(key).addEventListener("click", (event) => {
            event.preventDefault();
            const stockSymbol = event.target.id;
            fetch(
              `https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app/${user.uid}/AccountBalance.json`
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to fetch account balance");
                }
                return response.json();
              })
              .then((currentBalance) => {
                const amountToAdd = data[key].price * data[key].quantity;
                const newBalance = (currentBalance || 0) + amountToAdd;

                return fetch(
                  `https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app/${user.uid}/AccountBalance.json`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newBalance),
                  }
                );
              })
              .then((updateResponse) => {
                if (!updateResponse.ok) {
                  throw new Error("Failed to update account balance");
                }
                console.log("Account balance updated successfully");
              })
              .catch((error) => {
                console.error("Error updating account balance:", error);
              });
            fetch(
              `https://stockapp-553c7-default-rtdb.europe-west1.firebasedatabase.app/${user.uid}/BoughtStocks/${stockSymbol}.json`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                alert("Stock sold successfully!");
                window.location.reload();
              })
              .catch((error) => {
                console.error("Error selling stock:", error);
              });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching bought stocks:", error);
      });
  } else {
    console.error("User is not logged in or UID is missing.");
  }
});

document.getElementById("logout").addEventListener("click", logout);

async function fetchStocks(symbol) {
  const apiKey = "cv3ivs9r01ql2eurkv7gcv3ivs9r01ql2eurkv80";
  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  try {
    const response = await fetch(quoteUrl);
    if (!response.ok) {
      throw new Error("Invalid symbol or error fetching data");
    }
    const data = await response.json();
    return data.c;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../HomePage/home.html";
}
