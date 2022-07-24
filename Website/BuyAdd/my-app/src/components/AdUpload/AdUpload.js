import React, { Component, useState } from 'react';
import { Web3Storage } from 'web3.storage'
 

//token sil
function getAccessToken() {
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDljRmNiMWE0NDg2OGNhM2MxMzFDMWJjODQ3MDM0QTcwQmZFREYxNzYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg1Mzg0NDE3MzIsIm5hbWUiOiJEZWNlbnRyYWxpemVkQmlsbGJvYXJkQWRVcGxvYWQifQ.Slw-a8NVoZErPc-Z_kJVam51jXcOw0Oqn1DopUTQUos";
}

const token = getAccessToken();
const client = new Web3Storage( { token } )

function AdUpload( props ) {

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
				setOutput( cid );
				console.log(cid);
			} );

        }
		
	};
	

	return(
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
				<p>Select a file to show details</p>
			)}
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
	);


}

 
export default AdUpload;