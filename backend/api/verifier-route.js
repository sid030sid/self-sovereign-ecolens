const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require("fs")
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');

// load in helper functions
const {generateNonce, pemToJWK, buildVpRequestJwt} = require("../utils/helperFunctions");

// define presentation definition of ecopoints credentials
const ecopoint_vc_presentation_definition = {
    id: "EcopointsCredential", //TODO this needs to have an ID
    name: "EcopointsCredential",
    format: {
      jwt_vc: {
        alg: ["ES256"],
      },
    },
    input_descriptors: [
      {
        id: "Constraints",
        format: {
          jwt_vc: {
            alg: ["ES256", "ES384"]
          },
        },
        constraints: {
          fields: [
            {
              path: ["$.credentialSubject.ecopoints", "$.vc.credentialSubject.ecopoints"],
            },
            {
              path: ["$.credentialSubject.revocationStatus", "$.vc.credentialSubject.revocationStatus"],
            }
          ],
        },
      },
    ],
  }

// global variables
const serverURL = process.env.BASE_URL+"/api-verifier";
const authServerURL = process.env.BASE_URL+"/api-auth";
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");
const publicKey = fs.readFileSync("./certs/public.pem", "utf8");
const publicKeyAsJwk = pemToJWK(publicKey, "public")

// get vp request uri for ecopoints verifiable credentials
router.route("/generate-vp-request").get(async (req, res) => {
    try {
    // Get parameters from the request URL
    const stateParam = req.query.state || uuidv4();

    // Generate request uri for user to start OID4VP
    const request_uri = `${serverURL}/get-vp-request/${stateParam}?pd=${JSON.stringify(ecopoint_vc_presentation_definition)}`;

    // Build the VP request URI
    const vpRequest = `openid4vp://?client_id=${encodeURIComponent(serverURL)}&request_uri=${encodeURIComponent(request_uri)}`

    // Return the VP request as JSON
    res.status(200).json({state: stateParam, vpRequest: vpRequest});
    } catch (error) {
        console.error("Error in /generate-vp-request endpoint:", error);
        res.status(500).send("Internal server error");
    }
});

router.route('/get-vp-request/:state').get( async (req, res) => {
    try {
      const state = req.params.state || uuidv4();
      const pd = req.query.pd;
  
      if (!pd) {
        return res.status(400).send("Presentation definition is required");
      }
  
      const nonce = generateNonce(16);
      const response_uri = `${serverURL}/direct-post/${state}`;
      const clientId = `${serverURL}/direct-post/${state}`;
  
      const jwtToken = buildVpRequestJwt(
        state,
        nonce,
        clientId,
        response_uri,
        JSON.parse(pd),
        publicKeyAsJwk,
        serverURL,
        privateKey
      );
  
      return res.status(200).send(jwtToken.toString());
    } catch (error) {
      console.error("Error generating JWT:", error);
      return res.status(500).send("Internal Server Error");
    }
});

router.route('/direct-post/:state').post(async (req, res) => {
    try {
        const state = req.params.state;
        const decodedVPToken = jwt.decode(req.body.vp_token);
        const decodedVerifiableCredential = jwt.decode(decodedVPToken.vp.verifiableCredential[0]);
        const ecopoints = decodedVerifiableCredential.vc.credentialSubject.ecopoints;
        const revocationStatus = decodedVerifiableCredential.vc.credentialSubject.revocationStatus;
        const credentialTypes = decodedVerifiableCredential.vc.type;
        const issuer = decodedVerifiableCredential.vc.issuer;

        //check validity of verifiable presentation
        if(!credentialTypes.includes("EcopointsCredential")){ // correct credential type?
          return res.status(402).send("Invalid credential type");
        }
        // TODO: check revocation status in IPFS

        //since vc is valid, update frontend via websocket
        const wsClient = Array.from(req.app.get("wss").clients).find(client => client.state === state); //TODO for dev: this should be ws instead of wss
        if (wsClient && wsClient.readyState === WebSocket.OPEN) { // Check for WebSocket client and send token if connected
            wsClient.send(JSON.stringify({ ecopoints, issuer}));
        }

        res.status(200).send("Token sent via WebSocket");

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;