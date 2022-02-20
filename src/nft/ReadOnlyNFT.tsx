import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import FormLabel from '../common/components/FormLabel';
import FormTitle from '../common/components/FormTitle';
import { getAssetByID, getAssetUrl } from './nftService';
import './styles.css'

interface ReadOnlyNFTProps {
	nftId: string;
}

export function ReadOnlyNFT(props: ReadOnlyNFTProps) {
	const [nft, setNFT] = useState<any>({});

	useEffect(() => {
		const obtainAsset = async (assetId: string) => {
			const assetReceived = await getAssetByID(assetId)
			setNFT(assetReceived);
		}
		if (props.nftId) obtainAsset(props.nftId);
	}, [props.nftId]);

	const renderNFT = () => {
		if( !nft.assets || !nft.assets.length) return (
		<div className='center-element'>
			<Spinner color="info" size="2x"> </Spinner>
		</div>);
		const nftAsset = nft.assets[0];
		const nftParams = nft.assets[0].params;

		return(<>
				<FormLabel text={nftParams.name} label="Name:" />
				<FormLabel text={nftParams['unit-name']} label="Unit Name:" />
				<FormLabel text={nftParams.total} label="Total Supply:" />
				<div className="row-elements-start">
					<FormLabel text={nftParams.creator} label="Creator address:" /> 
				</div>
				<a href={getAssetUrl(nftAsset.index)} target="_blank" rel="noopener noreferrer" className='center-element mt-3' >
					#{nftAsset.index} on Algoexplorer <FontAwesomeIcon icon={faExternalLink} color="blue" className='ml-2' />
				</a>
		</>)
	}

	return (
		<>
			<FormTitle>Pet NFT:</FormTitle>
			{renderNFT()}
		</>
	)
}