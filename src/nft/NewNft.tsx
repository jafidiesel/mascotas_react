import { Accounts } from "@randlabs/myalgo-connect"
import React, { Props, useState } from "react"
import Form from "../common/components/Form"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormLabel from "../common/components/FormLabel"
import FormTitle from "../common/components/FormTitle"
import { createPetAsset, obtainNFTFromTxn, unlockAndConnect } from "./nftService"

interface NewNftProps {
	name: string;
	birthDate: string;
	description: string;
}

export default function NewNft(props: NewNftProps) {
	const [stepNumber, setStepNumber] = useState(0);
	const [accounts, setAccounts] = useState<Accounts[]>();

	const increaseStep = () => setStepNumber(stepNumber + 1);

	const connectToMAC = async () => {
		if(accounts && !!accounts?.length) return;
		// step 1
		increaseStep();
		const accountsAccess = await unlockAndConnect();
		console.log("step 1 complete", accountsAccess);
		setAccounts(accountsAccess);
	}

	const createNFT = async () => {
		if (!accounts?.length) return;
		// step 2
		increaseStep();
		const assetResponse = await createPetAsset(accounts[0].address, `${props.name} ${props.birthDate} ${props.description}`, props.name, props.name, '')
		console.log("step 2 complete", "assetResponse", assetResponse);

		// step 3
		increaseStep();
		setTimeout(async () => {
			const resp1 = await obtainNFTFromTxn(assetResponse);
			console.log("step 3 complete", "obtainNFTFromTxn", resp1);
		}, 15000)
	}



	return (
		<Form>
			<div>
				<FormTitle>NFT Pet:</FormTitle>
				<FormLabel text={(props.name.substring(0,31))} label="Name:" />
				<FormLabel text={(props.name).substring(0,7)} label="Unit Name:" />
				<FormLabel text="1" label="Total Supply:" />
				<FormLabel text="" label="Owner/Manager address:" /> 
			</div>
			<div>
				<h5>In order to create the Pet NFT you must:</h5>
				<p>Step 1: Unlock MyAlgo Wallet</p>
				<div>
					<FormButton  label="Connect" onClick={connectToMAC} disabled={accounts && !!accounts?.length}/>
					{`${accounts && !!accounts?.length}`}
					<p><b>Wallet status: </b>{ accounts?.length ? "Connected" : "Not connected" }</p>
				</div>
				<p>Step 2: sign and send pet NFT creation</p>
				<p>Step 3: Waiting for txn to be minted in order to obtain NFT ID and store it on Pet Schema</p>
			</div>
			<div>
				<p>Current step: {stepNumber}</p>
			</div>
		</Form>
	)
}