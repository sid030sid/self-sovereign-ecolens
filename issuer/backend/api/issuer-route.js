const router = require('express').Router();
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const fs = require("fs")
require("dotenv").config();

// load in helper functions
const {generateNonce} = require("../utils/helperFunctions");

// global variables
const serverURL = process.env.BASE_URL+"/api-issuer";
const authServerURL = process.env.BASE_URL+"/api-auth";
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");

// in-memory storage
const offerMap = new Map(); //TODO: optimize by using redis instead of in-memory storage

// Middleware to authenticate access tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const response = await fetch(`${authServerURL}/verifyAccessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return res.sendStatus(401);
    }
    const result = await response.text();
    console.log("authentication result:", result);
  } catch (error) {
    console.error("Error verifying token:", error);
  }
  next();
};


/* +++++++++++++++++++ Issuer Endpoints ++++++++++++++++++++++++ */
// offer credential that proves ownership of cid or grants access to private ipfs file
router.post("/offer", async (req, res) => {
    // get number of ecopoints that should be issued
    const ecopoints = req.body.ecopoints

    // create credential offer uuid and pre-authorized code
    const uuid = crypto.randomUUID();
    const pre_authorized_code = generateNonce(32);
    const credentialId = crypto.randomUUID();

    // get CID of IPFS based revocation status
      // sign credentialId and get the signatures CID
      const cid = "TODO"

    // prepare credential subject based on desired amount of ecopoints
    const credentialData = {
      credentialSubject: {
        credenitalId: credentialId,
        ecopoints: ecopoints,
        revocationStatus: cid
      },
      type: ["VerifiableCredential", "EcopointsCredential"]
    }

    // create credential offer
    offerMap.set(uuid, { pre_authorized_code, credentialData });

    // send credential offer uri for user to obtain credential via wallet
    let credentialOffer = `openid-credential-offer://?credential_offer_uri=${serverURL}/credential-offer/${uuid}`;
    res.send(credentialOffer);
});

// get credential offer and its pre-authorized code
router.route("/credential-offer/:id").get(async (req, res) => {
  const entry = offerMap.get(req.params.id);
  let pre_auth_code;
  let credentialData;

  if (entry) {
    ({
      pre_authorized_code: pre_auth_code,
      credentialData,
    } = entry);

    if (pre_auth_code) { //TODO: understand why this step is done for pre-auth code flow???
      offerMap.set(pre_auth_code, credentialData);
    }
  }

  const response = {
    credential_issuer: `${serverURL}`,
    credentials: credentialData?.type,
    grants: {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": pre_auth_code ?? crypto.randomUUID(), //TODO: understand why this step is done for pre-auth code flow???
        user_pin_required: true,
      },
    },
  };

  res.status(200).send(response);
});

// issue credential to user after successful authentication
router.route("/credential").post(authenticateToken, async (req, res) => {
  
  // get pre-authorization code from authorization access token
  const token = req.headers["authorization"].split(" ")[1];
  const { credential_identifier } = jwt.decode(token);

  // get proof of user's ownership of private key
  const requestBody = req.body;
  let decodedWithHeader;
  let decodedHeaderSubjectDID;
  if (requestBody.proof && requestBody.proof.jwt) {
    decodedWithHeader = jwt.decode(requestBody.proof.jwt, { complete: true });
    decodedHeaderSubjectDID = decodedWithHeader.payload.iss;
  }

  // get credential offer
  const credentialData = offerMap.get(credential_identifier);

  let credentialSubject = {
    id: decodedHeaderSubjectDID, //did of user attempting to obtain vc
    ...credentialData?.credentialSubject,
    issuance_date: new Date(
      Math.floor(Date.now() / 1000) * 1000
    ).toISOString(),
  }

  const payload = {
    iss: serverURL,
    sub: decodedHeaderSubjectDID || "",
    //exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    vc: {
      credentialSubject: credentialSubject,
      /*expirationDate: new Date(
        (Math.floor(Date.now() / 1000) + 60 * 60 * 48) * 1000 //48h validity
      ).toISOString(),*/
      id: decodedHeaderSubjectDID,
      issuanceDate: new Date(
        Math.floor(Date.now() / 1000) * 1000
      ).toISOString(),
      issued: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
      issuer: process.env.ISSUER_DID,
      type: credentialData?.type,
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://europa.eu/2018/credentials/eudi/pid/v1",
      ],
      validFrom: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
    },
  };

  const additionalHeaders = {
    kid: `${process.env.ISSUER_DID}#sig-key`,
    alg: "ES256",
    typ: "JWT",
  };

  // create vc
  const vc_jwt = jwt.sign(payload, privateKey, { algorithm: "ES256", header: additionalHeaders}); // TODO: should be created using ES256????

  // send jwt_vc to user
  res.json({
    format: "jwt_vc",
    credential: vc_jwt,
    c_nonce: generateNonce(),
    c_nonce_expires_in: 86400,
  });
});

router.route("/.well-known/openid-credential-issuer").get(async (req, res) => {
  const metadata = {
    credential_issuer: `${serverURL}`,
    authorization_server: `${authServerURL}`,
    credential_endpoint: `${serverURL}/credential`,
    credential_response_encryption: { //TODO: think about removing as only optional
      alg_values_supported: ["ECDH-ES"],
      enc_values_supported: ["A128GCM"],
      encryption_required: false,
    },
    display: [
      {
        name: "EPFL Restaurant 1",
        locale: "en-US",
        logo: { //TODO: logo's attribute should actually be uri not url according to OID4VCI
          url: "https://www.epfl.ch/about/overview/wp-content/uploads/2020/07/logo-epfl.png"
        },
      },
    ],
    credential_configurations_supported: {
      EcopointsCredential: {
        format: "jwt_vc_json",
        scope: "EcopointsCredential",
        cryptographic_binding_methods_supported: ["did:example"],
        credential_signing_alg_values_supported: ["ES256"],
        credential_definition: {
          type: ["VerifiableCredential", "EcopointsCredential"],
          credentialSubject: {
            credenitalId: {
              display: [
                {
                  name: "Credential Id",
                  locale: "en-US",
                },
              ],
            },
            ecopoints: {
              display: [
                {
                  name: "Number of Eco-points",
                  locale: "en-US",
                },
              ],
            },
            revocationStatus: {
              display: [
                {
                  name: "Revocation Status",
                  locale: "en-US",
                },
              ],
            }
          },
        },
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["ES256"],
          },
        },
        display: [
          {
            name: "Eco-points Credential powered by Ecolens",
            locale: "en-US",
            logo: {
              url: "https://zeroemission.group/wp-content/uploads/2020/01/zero_emission_logo_green2_v1_0.png",
            },
            background_color: "#12107c",
            text_color: "#FFFFFF",
          },
        ],
      }
    },
  };
  res.status(200).send(metadata);
});

module.exports = router;