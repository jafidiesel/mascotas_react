import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import DangerLabel from '../common/components/DangerLabel';
import FormInput from '../common/components/FormInput';
import { useErrorHandler } from '../common/utils/ErrorHandler';
import { getAssetByID } from '../nft/nftService';
import { ReadOnlyNFT } from '../nft/ReadOnlyNFT';
import './styles.css';

export function SearchPet() {
	const [searchBox, setSearchBox]= useState("")
	const [asset, setAsset]= useState("")

	const errorHandler = useErrorHandler();

	const SearchAsset = async () => {
		try {
			const assetFound = await getAssetByID(searchBox);
			setAsset(assetFound)
		} catch (error) {
			errorHandler.addError("searchBox", "Hubo un error con el ID buscado")
			console.error(error);
		}
	}

	return (
		<>
			<Card
				body
				color="light"
				className='card-width'
			>
				<CardBody>
					<CardTitle tag="h5">
						NFT ID (asset id):
					</CardTitle>
					<div className='search-bar'>
						<FormInput name='searchBox' value={searchBox} onChange={e => setSearchBox(e.target.value)} errorHandler={errorHandler}/>
						<Button color='primary' onClick={SearchAsset} disabled={!searchBox.length} >Buscar</Button>
					</div>
					<DangerLabel message={errorHandler.errorMessage} />
				</CardBody>
			</Card>
			<div className='row-elements-start'>
				{
					!!asset && <Card body color='light'>
						<CardBody>
							<ReadOnlyNFT nftId={searchBox}/>
						</CardBody>
					</Card>
				}
			</div>
		</>
	)
}