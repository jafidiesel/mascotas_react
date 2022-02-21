import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import DangerLabel from '../common/components/DangerLabel';
import FormInput from '../common/components/FormInput';
import { useErrorHandler } from '../common/utils/ErrorHandler';
import { getAssetByID, getAssetUrl, getTxnsAsset, getTxnUrl } from '../nft/nftService';
import { ReadOnlyNFT } from '../nft/ReadOnlyNFT';
import { searchPet } from './petsService';
import ReadOnlyNewPet from './ReadOnlyNewPet';
import './styles.css';

export function SearchPet() {
	const [searchBox, setSearchBox] = useState("")
	const [asset, setAsset] = useState(null)
	const [assetTransactions, setAssetTransactions] = useState<any>()
	const [pet, setPet] = useState(null)
	const [isSearching, setIsSearching] = useState(false)

	const errorHandler = useErrorHandler();

	const SearchAsset = async () => {
		errorHandler.cleanRestValidations();
		try {
			setIsSearching(true);
			const assetFound = await getAssetByID(searchBox);
			setAsset(assetFound)
			const petFound = await searchPet(searchBox);
			setPet(petFound)
			const assetTransactionsFound = await getTxnsAsset(searchBox)
			setAssetTransactions(assetTransactionsFound)
		} catch (error) {
			errorHandler.addError("searchBox", "Hubo un error con el ID buscado")
			console.error(error);
		}
		setIsSearching(false)
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
						<FormInput name='searchBox' value={searchBox} onChange={e => setSearchBox(e.target.value)} errorHandler={errorHandler} />
						<Button color='primary' onClick={SearchAsset} disabled={!searchBox.length || isSearching} >
							Buscar
							{isSearching && <Spinner color="info" size="sm" > </Spinner>}
						</Button>
					</div>
					<DangerLabel message={errorHandler.errorMessage} />
				</CardBody>
			</Card>
			<div className='row-elements-start'>
				{
					!!asset && !!pet && <Card body color='light' className='max-width-card'>
						<CardBody>
							<ReadOnlyNFT nftId={searchBox} />
							{
								!!assetTransactions && assetTransactions.transactions
								? <>
									<h5 className='text-center mt-2'>Transaction history</h5>
									{assetTransactions.transactions.map((txn: any, index: number) => (
										<a key={`txn-id-${txn.id}`} href={getTxnUrl(txn.id)} target="_blank" rel="noopener noreferrer" className='center-element mt-3' >
											View txn #{txn.id.substring(0,4) + "..." + txn.id.substring(txn.id.length - 4)} on Algoexplorer <FontAwesomeIcon icon={faExternalLink} color="blue" className='ml-2' />
										</a>
									))}
								</>
								: <Spinner color="info" size="sm" > </Spinner>
							}
						</CardBody>
					</Card>
				}
				{
					!!pet && <Card body color='light' className='max-width-card'>
						<CardBody>
							<ReadOnlyNewPet  {...pet} />
						</CardBody>
					</Card>
				}
			</div>
		</>
	)
}