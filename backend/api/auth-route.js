const router = require('express').Router();
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const fs = require("fs")
require("dotenv").config();

// load in helper functions
const {generateNonce, pemToJWK} = require("../utils/helperFunctions");

//global variables
const serverURL = process.env.BASE_URL+"/api-issuer";
const authServerURL = process.env.BASE_URL+"/api-auth";
const privateKey = fs.readFileSync("./certs/private.pem", "utf8");
const publicKey = fs.readFileSync("./certs/public.pem", "utf8");
const publicKeyAsJwk = pemToJWK(publicKey, "public")

// In-memory storage
const accessTokens = new Map(); //TODO: optimize by using redis instead of in-memory storage

// additional helper function
const generateAccessToken = (sub, credential_identifier) =>{
  const payload = {
    iss: `${serverURL}`,
    sub: sub,
    aud: `${serverURL}`,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000),
    scope: "openid",
    credential_identifier: credential_identifier,
  };
  // Sign the JWT
  const token = jwt.sign(payload, privateKey, { algorithm: "ES256" });

  return token;
}

router.route("/verifyAccessToken").post((req, res) => {
    const token = req.body.token;
  
    if (!token) {
      return res.status(400).send("Token is required");
    }
    
    // TODO: should be verified using ES256
    jwt.verify(token, publicKey, { algorithm: "ES256" }, (err, decoded) => { //TODO: should be public key
      if (err) {
        return res.status(401).send("Invalid token");
      }
  
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(402).send("Token has expired");
      }
  
      const storedToken = accessTokens.get(decoded.sub);
      if (storedToken !== token) {
        return res.status(403).send("Invalid token");
      }
  
      res.status(200).send("Token is valid");
    });
});
  
router.route("/.well-known/openid-configuration").get((req, res) => {
    const config = {
      issuer: `${serverURL}`,
      authorization_endpoint: `${authServerURL}/authorize`,
      token_endpoint: `${authServerURL}/token`,
      jwks_uri: `${authServerURL}/jwks`,
      scopes_supported: ["openid"],
      response_types_supported: ["vp_token", "id_token"],
      response_modes_supported: ["query"],
      grant_types_supported: ["authorization_code", "pre-authorized_code"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["ES256"],
      request_object_signing_alg_values_supported: ["ES256"],
      request_parameter_supported: true,
      request_uri_parameter_supported: true,
      token_endpoint_auth_methods_supported: ["private_key_jwt"],
      request_authentication_methods_supported: {
        authorization_endpoint: ["request_object"],
      },
      vp_formats_supported: {
        jwt_vp: {
          alg_values_supported: ["ES256"],
        },
        jwt_vc: {
          alg_values_supported: ["ES256"],
        },
      },
      subject_syntax_types_supported: [
        "did:key:jwk_jcs-pub",
      ],
      id_token_types_supported: [
        "subject_signed_id_token",
        "attester_signed_id_token",
      ],
    };
    res.status(200).send(config);
});

router.route("/token").post(async (req, res) => {

  // get data from wallet put inside req.body
  const pre_authorized_code = req.body["pre-authorized_code"];
  const user_pin = req.body["user_pin"];
  const grant_type = req.body["grant_type"];

  // check if pre-authorized_code grant type is used
  if (grant_type !== "urn:ietf:params:oauth:grant-type:pre-authorized_code") {
    console.log("Invalid grant_type: ", grant_type);
    return res.status(400).send("Only pre-authorized_code grant type is supported!");
  }

  // set credential identifier to pre-auth code
  const credential_identifier = pre_authorized_code;

  // check if user pin is valid
  //TODO: verify the user_pin with the issuer generated pin
  if (user_pin !== "1234") {
    console.log("Invalid pin: ", user_pin);
    return res.status(400).send("Invalid pin");
  }
    
  // create client id and access token
  const client_id = crypto.randomUUID();
  const generatedAccessToken = generateAccessToken(
    client_id,
    credential_identifier
  );
  accessTokens.set(client_id, generatedAccessToken);

  res.json({
    access_token: generatedAccessToken,
    token_type: "bearer",
    expires_in: 86400,
    c_nonce: generateNonce(16),
    c_nonce_expires_in: 86400,
  });
});

// endpoint for wallets to get jwks used by auth server to sign tokens
router.route("/jwks").get((req,res) => {
  res.json({
    keys: [
      {...publicKeyAsJwk, kid: `${process.env.ISSUER_DID}#sig-key`, use: "sig"},
      {...publicKeyAsJwk, kid: `${process.env.ISSUER_DID}#authentication-key`, use: "keyAgreement"}
    ]
  });
})

module.exports = router;