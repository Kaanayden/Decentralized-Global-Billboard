import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AdUpload from '../UploadAdIPFS/AdUpload/AdUpload';
import { Component, useState } from 'react';
import { Web3Storage } from 'web3.storage'
import {ethers} from 'ethers';


function bigNumberToFloat(val, decimals) {
    const DECIMAL_NUMBER = decimals;
    let decimalsNew = ethers.BigNumber.from( 10 ).pow( ethers.BigNumber.from( 18 - DECIMAL_NUMBER ) );
    let floatValue = val.div( decimalsNew ).toNumber() / 10 ** DECIMAL_NUMBER;
    return floatValue;
}

function getAccessToken() {
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDljRmNiMWE0NDg2OGNhM2MxMzFDMWJjODQ3MDM0QTcwQmZFREYxNzYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg1Mzg0NDE3MzIsIm5hbWUiOiJEZWNlbnRyYWxpemVkQmlsbGJvYXJkQWRVcGxvYWQifQ.Slw-a8NVoZErPc-Z_kJVam51jXcOw0Oqn1DopUTQUos";
}
const token = getAccessToken();
const client = new Web3Storage( { token } )

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function convertToUTCUnix( date ) {
    return date.getTime() / 1000 - date.getTimezoneOffset() * 60;
}

export default function AddModal(props) {
    const {addDate, contract} = props;  
    const [open, setOpen] = React.useState(false);
    const [price, setPrice] = React.useState();

    const handleOpen = () => {
        setOpen(true);
        let time = Math.floor( convertToUTCUnix( addDate ) );
        contract.getCurrentPrice( time )
        .then( val => {
            setPrice( bigNumberToFloat( val, 4 ) + " BBRD");
        } )
        
    };
    const handleClose = () => setOpen(false);

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [output, setOutput] = useState();
    
    //const UPLOAD_API_URL = "https://decentralized-billboard.herokuapp.com/uploadAd";

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	async function storeFile ( file ) {
		const filesArray = [];
		filesArray.push( file );
		const cid = await client.put(filesArray);
		return cid;
	  }

	async function retrieveFile( cid ) {
		const res = await client.get(cid)
		const files = await res.files()
		return files[0];
	}

	const handleSubmission = () => {
		
        if( isFilePicked ) {
			
			storeFile( selectedFile )
			.then( cid => {
                let url = "https://" + cid + ".ipfs.dweb.link/" + selectedFile.name;
				let time = Math.floor( convertToUTCUnix( addDate ) );
                contract.buyAd( time, url )
                .then( () => {
                    setOutput("Ad bought in decentralized. Ad uploaded to " + url );
                } )
                
				
			} );

        }
		
	};
	

    return (
        <div>
        {<Button onClick={handleOpen}>Buy</Button>}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div>{addDate.getHours().toString() + ":" + addDate.getMinutes().toString()}</div>
                <div>Price: {price}</div>
                <div>
			<input type="file" name="file" onChange={changeHandler} />
			{isFilePicked ? (
				<div>
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.lastModifiedDate.toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to buy advertisement</p>
			)}
			<div>
				{isFilePicked && <button onClick={handleSubmission}>Submit</button>}
                {output}
            </div>
		</div>

            </Box>
        </Modal>
        </div>
    );
}
