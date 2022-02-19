import MyAlgoConnect, { Accounts } from "@randlabs/myalgo-connect";
import algosdk from "algosdk";
import Axios from "axios";

const algorandNetwork = process.env.REACT_APP_ALGORAND_NETWORK?.toLocaleLowerCase();
const myAlgoConnect = new MyAlgoConnect()
const apiClient = new algosdk.Algodv2("", `https://api.${algorandNetwork}.algoexplorer.io`, '');
const indexerBasePath = `https://algoindexer.${algorandNetwork}.algoexplorerapi.io`;

export async function unlockAndConnect(): Promise<Accounts[]> {
	const settings = {
		shouldSelectOneAccount: true,
		openManager: false
	};
	return await myAlgoConnect.connect(settings);
}

export async function sendDummyPay(addressFrom: string, addressTo: string, note?: string): Promise<any> {
	const params = await apiClient.getTransactionParams().do();
	const enc = new TextEncoder();
	const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
		suggestedParams: {
			...params
		},
		from: addressFrom,
		to: addressTo,
		amount: 0,
		note: enc.encode(note || '')
	});
	const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());

	const txnSent = await apiClient.sendRawTransaction(signedTxn.blob).do();
	return txnSent;
}

export async function createPetAsset(from: string, note: string, unitname: string, assetName: string, assetURL: string): Promise<string> {
	const params = await apiClient.getTransactionParams().do();

	const enc = new TextEncoder();

	const assetCreateTxn = await algosdk.makeAssetCreateTxnWithSuggestedParams(
		from,
		enc.encode(note || ''),
		1,
		0,
		false,
		from, // this field should be undefined in order to be imposible to delete by the creator
		undefined, undefined, undefined, unitname, assetName, assetURL, undefined, params
	);

	const signedTxn = await myAlgoConnect.signTransaction(assetCreateTxn.toByte());
	const txnSent = await apiClient.sendRawTransaction(signedTxn.blob).do();
	const { txId } = txnSent;
	return txId;
}

export async function obtainNFTFromTxn(txId: string) {

	
	const assetFromTxn = await getTransactionByTxnId(txId)
	console.log("step 3.1 complete","getTransactionByTxnId", assetFromTxn.transaction["created-asset-index"], assetFromTxn);

	const asset = (await getAssetByID(assetFromTxn.transaction["created-asset-index"]));
	console.log("step 3.2 complete","getAssetByID", asset);
	return asset;
}

export async function getTransactionByTxnId(txnId: string) {
	return await (await Axios.get(indexerBasePath + "/v2/transactions/" + txnId)).data
}

async function getAssetByID(assetId: number|string): Promise<any> {
	return (await Axios.get(indexerBasePath + `/v2/assets?asset-id=${assetId}`)).data
}

export async function waitForConfirmation(txId: string) {
	return algosdk.waitForConfirmation(apiClient, txId, 4);
}

export function getAssetUrl(assetId: string ): string {
	return `https://${algorandNetwork}.algoexplorer.io/asset/${assetId}`
}