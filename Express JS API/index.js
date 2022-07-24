const express = require('express');
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
//const  {Web3Storage, getFilesFromPath } = require ('web3.storage');
const fetch = require('node-fetch');
const { ethers} = require("ethers");
//

const app = express();
app.use( cors() )
app.use( fileupload() );
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//it's like mock implemantation, we aim making test with screenshot of the webpage and ad image comparison in more powerful server.
const AD_ELEMENT = '<img id="GlobalBillboard" src=""><script>fetch( "https://decentralized-billboard.herokuapp.com/currentAdUrl" ).then( response => response.json() ).then( response =>  document.getElementById("GlobalBillboard").setAttribute("src", response.url ) )</script>';


const INFURA_RPC = "https://kovan.infura.io/v3/TOKEN";
const CONTRACT_ADRESS = "0x2Fb9CAaEc0aBEd9eBF9A2487aFEC5121a18A78b9";
const contractAbi = [
    "function getCurrentAd() view returns(string)"
];

const port = 3000;



//ad element which billboard showers must show
//element can be changed with voting of new API proposal on-chain.

//traffic data is mock currently
function fetchTrafficData( domainName ) {
    let traffic;
    if( domainName.length == 0 ) {
        traffic = 0;
    } else {
        traffic = domainName.length % 10;
        traffic++;
    }

    return traffic;
}





app.get('/adCheck', (req, res) => 
{
    const checkUrl = req.query.toCheckUrl;
    //check ad element


    fetch( checkUrl, {
    }).then(data =>data.text() )
    .then( data => {
        if( data.includes( AD_ELEMENT ) ) {
            res.json({
                "TRAFFIC" : 1
            });
        } else {
            res.json({
                "TRAFFIC" : 0
            });
        }

})
.catch( (error) => {
    res.json({
        "TRAFFIC" : 0
    });
} );







});

//return traffic data 0, if there is no ad element
app.get('/getTrafficDataandAdCheck', (req, res) => 
{
    let checkUrl = req.query.toCheckUrl;
    let traffic;

    traffic = fetchTrafficData( checkUrl );

    if( traffic == 0 ) {
        res.json({
            "TRAFFIC" : 0
        });
    } else {
    //check ad element

        fetch(checkUrl
            ).then(data =>data.text() )
            .then( data => {
                if( data.includes( AD_ELEMENT ) ) {
                    res.json({
                        "TRAFFIC" : traffic
                    });
                } else {
                    res.json({
                        "TRAFFIC" : 0
                    });
                }
            })
            .catch( (error) => {
                res.json({
                    "TRAFFIC" : 0
                });
            } );


        }
    });

//

async function getAd() {
    const provider = new ethers.providers.JsonRpcProvider( INFURA_RPC );
    const contract = new ethers.Contract( CONTRACT_ADRESS, contractAbi, provider );
    let result = await contract.getCurrentAd();
    if (result.length == 0) {
        return "https://bafybeiaamybmn6f7h2ru646dwwz5kwa7vhddzcexbawjmiwj7nneg72n2y.ipfs.dweb.link/exampleAd.png";
    }
    return result;
    
    }

app.get('/currentAdUrl', (req, res) => 
{
    getAd()
    .then( adUrl => {
        res.json({
            "url" : adUrl
        });
    } )

});

  //image uploading is directly from react

/*
async function storeFiles ( path, res ) {
    const files = await getFilesFromPath(path);
    const cid = await client.put(files);
    return cid;

  }
*/

/*
app.post('/uploadAd', (req, res) =>
{
    
    const file = req.files.sampleFile;
    let path = "/";
    file.mv(path);

    storeFiles( path, res )
    .then( cid => {
        res.json({
            "cid" : cid
        });
    } );


});
*/

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));
