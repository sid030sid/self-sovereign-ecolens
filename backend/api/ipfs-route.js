const router = require('express').Router();
const crypto = require('crypto');
require("dotenv").config();
const {PinataSDK: PinataIpfsApi} = require("pinata-web3");

// load in helper functions
const {calculateCid} = require("../utils/helperFunctions");

// instantiate the ipfs api aka public ipfs storage
const ipfsApi = new PinataIpfsApi({
  pinataJwt: process.env.PINATA_API_JWT,
  pinataGateway: process.env.PINATA_API_GATEWAY,
});

router.route('/get-cid').post(async (req, res)=>{
    try {
        if(req.body.data===""){
            res.send("ERROR - Invalid query: missing data in body")
        }

        // prepare file for getting its CID
        const filename = req.body.fileName // get file name (e. g. credential ID)
        const file = new File([JSON.stringify(req.body.data)], filename, { type: "text/plain" });

        // get CID of file without uploading it to IPFS
        const cid = await calculateCid(file)
        
        // send response to frontend
        if(cid != ""){
            res.send(cid)
        }else{
            res.send("ERROR")
        }
    } catch (error) {
        console.log(error)
    }
})

router.route('/upload').post(async (req, res)=>{
    try {
        if(req.body.data===""){
            res.send("ERROR - Invalid query: missing data in body")
        }

        // prepare file for upload to ipfs
        const filename = req.body.fileName || crypto.randomUUID() //get filename or create nonce to name file
        const file = new File([JSON.stringify(req.body.data)], filename, { type: "text/plain" });

        // upload file to ipfs depending on configuration set by user in query 
        const upload = await ipfsApi.upload.file(file);
        const cid = upload.IpfsHash;

        // send response to frontend
        if(cid !== ""){
            res.send(cid)
        }else{
            res.send("ERROR")
        }
    } catch (error) {
        console.log(error)
    }
})

router.route('/download/:cid').get(async (req, res) => {
    try {
        const cid = req.params.cid;

        if (cid === "") {
            return res.status(400).send("ERROR - Invalid query: missing cid in params");
        }

        const data = await ipfsApi.gateways.get(cid);

        // If data was found, send it to the client
        if (data) {
            return res.send(data);
        } else {
            return res.status(201).send("File not found on IPFS");
        }
    } catch (error) {
        if (error instanceof ipfsApi.errors.AuthenticationError) {
            // Handle the specific AuthenticationError
            return res.status(201).send("File not found on IPFS");
        } else {
            console.error("Error in download route:", error);
            return res.status(500).send("Server error");
        }
    }
});

module.exports = router;