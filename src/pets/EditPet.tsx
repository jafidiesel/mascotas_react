import React, { useEffect, useState } from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import "../styles.css"
import { deletePet, loadPet, savePet } from "./petsService"
import DangerLabel from "../common/components/DangerLabel"
import FormInput from "../common/components/FormInput"
import FormButtonBar from "../common/components/FormButtonBar"
import FormButton from "../common/components/FormButton"
import FormWarnButton from "../common/components/FormWarnButton"
import FormTitle from "../common/components/FormTitle"
import Form from "../common/components/Form"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"

import FormLabel from "../common/components/FormLabel"
import FormContentButton from "../common/components/FormContentButton"
import './styles.css'
import { ReadOnlyNFT } from "../nft/ReadOnlyNFT"

export default function EditPet(props: RouteComponentProps<{ id: string }>) {
	const [birthDate, setBirthDate] = useState("")
	const [description, setDescription] = useState("")
	const [petId, setPetId] = useState("")
	const [name, setName] = useState("")
	const [ownerName, setOwnerName] = useState("")
	const [ownerId, setOwnerDNI] = useState("")
	const [nftId, setNFTId] = useState("")
	
	const errorHandler = useErrorHandler()

	const loadPetById = async (id: string) => {
		if (id) {
			try {
				const result = await loadPet(id)
				setBirthDate(result.birthDate)
				setPetId(result.id)
				setName(result.name)
				setDescription(result.description)
				setNFTId(result.nftId)
				setOwnerName(result.ownerName)
				setOwnerDNI(result.ownerId)
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
		if (!birthDate) {
			errorHandler.addError("birthDate", "No puede estar vacío")
		}
		if (!description) {
			errorHandler.addError("description", "No puede estar vacío")
		}
		if (!ownerName) {
			errorHandler.addError("ownerName", "No puede estar vacío")
		}
		if (!ownerId) {
			errorHandler.addError("ownerId", "No puede estar vacío")
		}

		if (errorHandler.hasErrors()) {
			return
		}

		try {
			await savePet({ id: petId, name, birthDate, description, nftId, ownerName, ownerId })
			props.history.push("/pets")
		} catch (error: any) {
			errorHandler.processRestValidations(error)
		}
	}

	useEffect(() => {
		const id = props.match.params.id
		if (id) {
			void loadPetById(id)
		}
	}, [])



	return (
		<GlobalContent>
			<div className="columns">
				<div>
					<FormTitle>Registrar Mascota</FormTitle>
					<h4>Datos de la mascota:</h4>
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
						<FormLabel text={nftId} label="NFT Id" /> 





						<hr></hr>
						<h4>Datos del dueño:</h4>
						<FormInput
							label="Nombre y Apellido"
							name="nameLastname"
							value={ownerName}
							onChange={(event) => setOwnerName(event.target.value)}
							errorHandler={errorHandler}
						/>
						<FormInput
							label="DNI"
							name="dni"
							value={ownerId}
							onChange={(event) => setOwnerDNI(event.target.value)}
							errorHandler={errorHandler}
						/>


						<DangerLabel message={errorHandler.errorMessage} />
						<FormButtonBar>
							<FormContentButton className="btn btn-success" content="Actualizar mascota" onClick={saveClick} />
							<FormButton label="Cancelar" onClick={() => goHome(props)} />
							<FormWarnButton
								hidden={!petId}
								label="Eliminar"
								onClick={deleteClick}
								/>
						</FormButtonBar>
					</Form>
				</div>
				<div>
					{!!nftId && <ReadOnlyNFT nftId={nftId} />}
					{/* <NewNFT nftInProcess={nftInProcess} setNFTId={handlerNFTId} ownerName={ownerName} ownerId={ownerId}  birthDate={birthDate} description={description} name={name} /> */}
				</div>
				
			</div>

			
		</GlobalContent>
	)
}
