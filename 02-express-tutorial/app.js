console.log("Express Tutorial");

const { products } = require("./data");
const express = require("express");
const peopleRouter = require("./routes/people");

const app = express();

// ---------- MIDDLEWARES ----------

// Logger middleware
const logger = (req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Line tells the server to serve statics files from the "public" folder
//app.use(express.static("./public"));
app.use(express.static("./methods-public"));

// ---------- TEST ROUTES ----------

//request#1 - to test route
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "It worked!" });
});

// Test route to confirm logger runs
app.get("/api/v1/testlog", (req, res) => {
  res.json({ message: "logger worked!" });
});

// ---------- PRODUCTS ROUTES ----------

// Returns all products
app.get("/api/v1/products", (req, res) => {
  res.json(products);
});

//req#3 - Returns a specific product based on (parameter) the ID provided in the URL
app.get("/api/v1/products/:productID", (req, res) => {
  const idToFind = parseInt(req.params.productID);
  const product = products.find((p) => p.id === idToFind);

  if (!product) {
    return res.status(404).json({ message: "That product was not found." });
  }
  res.json(product);
});

//req#4 - Returns filtered products based on query parameters
app.get("/api/v1/query", (req, res) => {
  const { search, limit, maxPrice } = req.query;
  let filteredProducts = [...products];

  // Filter products by name or description if the search term is provided
  if (search) {
    const searchTerm = search.toLowerCase();

    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  //Filter products by price if maxPrice is provided
  if (maxPrice) {
    const priceLimit = parseFloat(maxPrice);
    if (!isNaN(priceLimit)) {
      filteredProducts = filteredProducts.filter((p) => p.price <= priceLimit);
    }
  }

  //Limit the number of products returned if limit is provided
  if (limit) {
    const limitNumber = parseInt(limit);
    if (!isNaN(limitNumber)) {
      filteredProducts = filteredProducts.slice(0, limitNumber);
    }
  }
  //Return 404 if no products match the query
  if (filteredProducts.length === 0) {
    return res.status(404).json({ message: "No products matched your query" });
  }

  res.json(filteredProducts);
});

// ---------- PEOPLE ROUTES (ROUTER + CONTROLLERS) ----------

app.use("/api/v1/people", peopleRouter);

// ---------- 404 HANDLER ----------
app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});

// ---------- START SERVER ----------
app.listen(3000, () => {
  console.log("Server listening in port 3000...");
});
