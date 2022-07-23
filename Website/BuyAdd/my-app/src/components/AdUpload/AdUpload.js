import React, { Component, useState } from 'react';
import axios from 'axios';

function AdUpload( props ) {

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [output, setOutput] = useState();
    
    const UPLOAD_API_URL = "https://decentralized-billboard.herokuapp.com/uploadAd";

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
		
        if( isFilePicked ) {
            const formData = new FormData();
            formData.append('File', selectedFile);

        axios.post( UPLOAD_API_URL, formData )
        .then( response => {
            console.log(response.data);
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