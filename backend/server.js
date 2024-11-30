const express = require("express");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 4001;

const app = express();

// enable frontend to call endpoints
app.use(cors());

// For parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to get data send by wallets into req.body

// use API for issuer service
const apiIssuerRouter = require("./api/issuer-route.js");
app.use("/api-issuer", apiIssuerRouter);

// use API for authentication service
const apiAuthRouter = require("./api/auth-route.js");
app.use("/api-auth", apiAuthRouter);

//if production give app static assets (e.g. favicon and all routes)
if(process.env.NODE_ENV === "production"){
  // allow app to use static files of build folder
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")))

  // enable app to detect all url routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });  
};

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});