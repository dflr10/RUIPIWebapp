const d = document,
  $donation = d.getElementById("donation"),
  $template = d.getElementById("donation-template").content,
  $fragment = d.createDocumentFragment(),
  publicKey =
    "pk_test_51Ietn5KfR0EILek5IlTREE5ZjUHQUDCbAvbCGDBlBba9QUY4oyetLidHmHc0Js8b6XGImmJGUb3R9VIPV1TzDX9j00rjwIQyUL",
  secretKey =
    "sk_test_51Ietn5KfR0EILek5mDOud5iZx6LeZRJXQvGffUjLj6EUXM7519R9Ps66ZFHXFnoDmSc0Kk8WfkQPJiXv2Mld46C7008Z5NItOF",
  fetchOptions = {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  };

let products, prices;
//console.log(STRIPE_KEYS.secret);

const moneyFormat = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`;

Promise.all([
  fetch("https://api.stripe.com/v1/products", fetchOptions),
  fetch("https://api.stripe.com/v1/prices", fetchOptions),
])
  .then((responses) => Promise.all(responses.map((res) => res.json())))
  .then((json) => {
    //console.log(json);

    products = json[0].data;
    prices = json[1].data;
    //console.log(products, prices);
    //console.log($template);

    prices.forEach((el) => {
      let productData = products.filter((product) => product.id === el.product);
      //console.log(productData);

      $template.querySelector(".donate").setAttribute("data-price", el.id);
      $template.querySelector("img").src = productData[0].images[0];
      $template.querySelector("img").alt = productData[0].name;
      $template.querySelector("figcaption").innerHTML = `${productData[0].name}
      <br>
      ${moneyFormat(el.unit_amount_decimal)} ${el.currency}
      `;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $donation.appendChild($fragment);
  })
  .catch((err) => {
    //console.log(err);
    let message = err.statusText || "ERROR trying to connect to STRIPE API";
    $donation.innerHTML = `<p><b>Error ${err.status}: ${message}</b></p>`;
  });

d.addEventListener("click", (e) => {
  if (e.target.matches(".donate-us")) {
    try {
      d.getElementById("remove").classList.remove("hide-donation");
    } catch (error) {}
  } else {
    d.getElementById("remove").classList.add("hide-donation");
  }

  if (e.target.matches(".donate *")) {
    let price = e.target.parentElement.getAttribute("data-price");
    //console.log(price);

    Stripe(publicKey)
      .redirectToCheckout({
        lineItems: [{ price, quantity: 1 }],
        mode: "subscription",
        successUrl: "http://127.0.0.1:5501/snipets/successUrl.html",
        cancelUrl: "http://127.0.0.1:5501/snipets/cancelUrl.html",
      })
      .then((res) => {
        console.log(res);
        if (res.error) {
          $donation.insertAdjacentElement("afterend", res.error.message);
        }
      });
  }
});
