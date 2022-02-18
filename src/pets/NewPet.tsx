import React, { useEffect, useState } from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import "../styles.css"
import { deletePet, loadPet, savePet } from "./petsService"
import DangerLabel from "../common/components/DangerLabel"
import FormInput from "../common/components/FormInput"
import FormButtonBar from "../common/components/FormButtonBar"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormWarnButton from "../common/components/FormWarnButton"
import FormTitle from "../common/components/FormTitle"
import Form from "../common/components/Form"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"


import { sendDummyPay, unlockAndConnect, createPetAsset, obtainNFTFromTxn } from "../nft/nftService"
import NewNft from "../nft/NewNft"

export default function NewPet(props: RouteComponentProps<{ id: string }>) {
	const [birthDate, setBirthDate] = useState("")
	const [description, setDescription] = useState("")
	const [petId, setPetId] = useState("")
	const [name, setName] = useState("")
	const [showAllObject, setShowAllObject] = useState<any[]>([{}]);

	const errorHandler = useErrorHandler()



	const loadPetById = async (id: string) => {
		if (id) {
			try {
				const result = await loadPet(id)
				setBirthDate(result.birthDate)
				setPetId(result.id)
				setName(result.name)
				setDescription(result.description)
			} catch (error: any) {
				errorHandler.processRestValidations(error)
			}
		}
	}
	const deleteClick = async () => {
		if (petId) {
			try {
				await deletePet(petId)
				props.history.push("/pets")
			} catch (error: any) {
				errorHandler.processRestValidations(error)
			}
		}
	}

	const saveClick = async () => {
		errorHandler.cleanRestValidations()
		if (!name) {
			errorHandler.addError("name", "No puede estar vacío")
		}

		if (errorHandler.hasErrors()) {
			return
		}

		try {
			if (petId) {
				await savePet({ id: petId, name, birthDate, description, nftId: "1" })
			} else {
				
				// call here for the NFT creation?
				// or maybe the NFT component should have a method prop to call it when 
				// the "create pet" process begins

				// this "create pet"  process consist on unlocking and connecting to the account, 
				// creating the NFT, look for the creation txn and obtain the asset id
				// and save the pet on the pet system with the NFT id


				//await newPet({ name, birthDate, description: description, nftId: '1234' })
			}
			//props.history.push("/pets")
		} catch (error: any) {
			errorHandler.processRestValidations(error)
		}
	}

	useEffect(() => {

		const connect = async (): Promise<void> => {
			const response = await unlockAndConnect();
			console.log(response);
			console.log(await sendDummyPay(response[0].address, response[0].address));
		}

		/* connect().then(
		  () =>  {},
		  () =>  {},
		) */

		const id = props.match.params.id
		if (id) {
			void loadPetById(id)
		}
	}, [])



	return (
		<GlobalContent>
			<div className="columns">
				<div>
					<FormTitle>Nueva Mascota</FormTitle>
					<Form>
						<FormInput
							label="Nombre"
							name="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							errorHandler={errorHandler}
						/>
						<FormInput
							label="Descripción"
							name="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							errorHandler={errorHandler}
						/>
						<FormInput
							label="Fecha de Nacimiento"
							name="birthDate"
							value={birthDate}
							onChange={(event) => setBirthDate(event.target.value)}
							errorHandler={errorHandler}
						/>
						<DangerLabel message={errorHandler.errorMessage} />
						<FormButtonBar>
							<FormAcceptButton label="Guardar" onClick={saveClick} />
							<FormWarnButton
								hidden={!petId}
								label="Eliminar"
								onClick={deleteClick}
							/>
							<FormButton label="Cancelar" onClick={() => goHome(props)} />
						</FormButtonBar>
					</Form>
				</div>
				<div>
					<NewNft  birthDate={birthDate} description={description} name={name} />
				</div>
				
			</div>

			
		</GlobalContent>
	)
}
