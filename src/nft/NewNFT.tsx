import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Accounts } from "@randlabs/myalgo-connect"
import React, { useState } from "react"
import { Spinner } from "reactstrap"
import Form from "../common/components/Form"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormLabel from "../common/components/FormLabel"
import FormTitle from "../common/components/FormTitle"
import { createPetAsset, unlockAndConnect, waitForConfirmation } from "./nftService"
import './styles.css'

interface NewNFTProps {
	name: string;
	birthDate: string;
	description: string;
	ownerName: string;
	ownerId: string;
	nftInProcess: boolean;
	setNFTId: (id: string) => void;
}

export default function NewNFT(props: NewNFTProps) {
	const [stepNumber, setStepNumber] = useState(0);
	const [isWaiting, setIsWaiting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [account, setAccount] = useState<Accounts[]>();

	const increaseStep = () => setStepNumber(stepNumber + 1);

	const connectToMAC = async () => {
		if(account && !!account?.length) return;
		// step 1
		increaseStep();
		const accountsAccess = await unlockAndConnect();
		setAccount(accountsAccess);
	}

	const createNFT = async () => {
		if (!account?.length) return;
		// step 2
		increaseStep();
		const txId = await createPetAsset(account[0].address, textAreaValue , props.name.substring(0,7), props.name.substring(0,31), '')
		setIsWaiting(true);

		
		// step 3
		increaseStep();
		const confirmation = await waitForConfirmation(txId)
		props.setNFTId(confirmation['asset-index'])
		setIsWaiting(false);
		setIsCompleted(true);
	}

	const textAreaValue = `{
	pet: {
		name: ${props.name||''},
		description: ${props.description||''},
		birthDate: ${props.birthDate||''}
	},
	owner: {
		name: ${props.ownerName},
		dni: ${props.ownerId}
	}
}
`;


	return (
		<Form>
			<div>
				<FormTitle>Pet NFT:</FormTitle>
				<FormLabel text={props.name.substring(0,31)} label="Name:" />
				<FormLabel text={props.name.substring(0,7)} label="Unit Name:" />
				<FormLabel text="1" label="Total Supply:" />
				<div className="row-elements-start">
					<FormLabel text={account && account.length ? account[0].address : ""} label="Creator address:" /> 
				</div>
				<h6>Note Field</h6>
				<textarea disabled  rows={8} cols={25} value={textAreaValue} className="note-field" />
			</div>
			{(props.nftInProcess || isCompleted) && <>
				<div>
					<h5>In order to create the Pet NFT you must:</h5>
					<div >
						<div className="row-elements" >
							<FormAcceptButton  label={account?.length ? "Connected!" : "Connect Wallet"} onClick={connectToMAC} disabled={account && !!account?.length}/>
							<span>Step 1: Unlock MyAlgo Wallet</span>
					</div>
					</div>
					<div className="row-elements"  >
						<FormAcceptButton  label={ (isWaiting || isCompleted) ? "NFT sent!" : "Create NFT"} onClick={createNFT} disabled={isWaiting || isCompleted} />
						<span>Step 2: sign and send pet NFT creation</span>
					</div>
					<div className="row-elements"  >
						{ isCompleted && <FontAwesomeIcon size="2x" icon={faCheckCircle} className="mx-2" color="green"/>}
						{isWaiting && <Spinner
							color="info"
							size="sm"
							> </Spinner>}
						<span>Step 3: Waiting for confirmation</span>

					</div>
				</div>
			</>}
		</Form>
	)
}