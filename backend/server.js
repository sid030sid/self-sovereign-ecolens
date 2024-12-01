const express = require("express");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3001;

const app = express();

// enable frontend to call endpoints
app.use(cors());

// For parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to get data send by wallets into req.body

// Set up WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.set("wss", wss);

// Store active WebSocket clients with their unique identifiers
const clients = new Map();

wss.on("connection", (ws, req) => {
  // This example assumes a URL parameter `cid` or another identifier
  const url = new URL(req.url, `http://${req.headers.host}`);
  const state = url.searchParams.get("state");
  ws.state = state;
  
  if (state) {
    // Map the connection to the user's unique `cid`
    clients.set(state, ws);
    console.log("WebSocket client connected with state:", state);

    ws.on("close", () => {
      clients.delete(state);
    });
  }
});

// use API for verifier service
const apiVerifierRouter = require("./api/verifier-route.js");
app.use("/api-verifier", apiVerifierRouter);

// use API for IPFS
const apiIpfsRouter = require("./api/ipfs-route");
app.use("/api-ipfs", apiIpfsRouter);

//if production give app static assets (e.g. favicon and all routes)
if(process.env.NODE_ENV === "production"){
  // allow app to use static files of build folder
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")))

  // enable app to detect all url routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });  
};

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});