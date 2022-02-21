import React, { useState } from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import "../styles.css"
import { newPet } from "./petsService"
import DangerLabel from "../common/components/DangerLabel"
import FormInput from "../common/components/FormInput"
import FormButtonBar from "../common/components/FormButtonBar"
import FormButton from "../common/components/FormButton"
import FormTitle from "../common/components/FormTitle"
import Form from "../common/components/Form"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"


import NewNFT from "../nft/NewNFT"
import FormLabel from "../common/components/FormLabel"
import { Spinner } from "reactstrap"
import FormContentButton from "../common/components/FormContentButton"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

export default function NewPet(props: RouteComponentProps<{ id: string }>) {
	const [birthDate, setBirthDate] = useState("")
	const [description, setDescription] = useState("")
	const [name, setName] = useState("")
	const [ownerName, setOwnerName] = useState("")
	const [ownerId, setOwnerDNI] = useState("")
	const [nftId, setNFTId] = useState("")
	const [nftInProcess, setNFTInProcess] = useState(false)
	
	const errorHandler = useErrorHandler()

	const handlerNFTProcess = (flag: boolean) => {
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
		setNFTInProcess(flag);
	}

	const handlerNFTId = (nftId: string) => {
		setNFTId(nftId);
		handlerNFTProcess(false);
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
			await newPet({ name, birthDate, description, nftId, ownerName, ownerId})
			props.history.push("/pets")

		} catch (error: any) {
			errorHandler.processRestValidations(error)
		}
	}


	return (
		<GlobalContent>
			<div className="columns">
				<div>
					<FormTitle>Registrar Mascota</FormTitle>
					<h4>Datos de la mascota:</h4>
					<Form>
						<FormInput
							label="Nombre *"
							name="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess || !!nftId}
						/>
						<FormInput
							label="Descripción *"
							name="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess || !!nftId}
						/>
						<FormInput
							label="Fecha de Nacimiento *"
							name="birthDate"
							value={birthDate}
							onChange={(event) => setBirthDate(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess || !!nftId}
						/>
						<div className="row-elements-start">
							<FormLabel text={nftId} label="NFT Id" /> 
							{ !!nftId && <FontAwesomeIcon size="2x" icon={faCheckCircle} className="mx-2" color="green"/>}
						</div>


						<hr></hr>
						<h4>Datos del dueño:</h4>
						<FormInput
							label="Nombre y Apellido *"
							name="nameLastname"
							value={ownerName}
							onChange={(event) => setOwnerName(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess || !!nftId}
						/>
						<FormInput
							label="DNI *"
							name="dni"
							value={ownerId}
							onChange={(event) => setOwnerDNI(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess || !!nftId}
						/>


						<p>* campos requeridos</p>
						<DangerLabel message={errorHandler.errorMessage} />
						<FormButtonBar>
							<FormContentButton
								onClick={() => handlerNFTProcess(true)}
								disabled={!!nftId || nftInProcess}
								className="btn btn-primary"
								content={
									<>
										<span>Preparar Pet NFT</span>
										{nftInProcess && <Spinner color="info" size="sm" > </Spinner>}
										{ !!nftId && <FontAwesomeIcon size="2x" icon={faCheckCircle} className="mx-2" color="white"/>}
									</>
								}
							/>
							<FormButton label="Cancelar" onClick={() => goHome(props)} />
						</FormButtonBar>
						<br></br>
						{nftId && <FormContentButton className="btn btn-success" content="Guardar mascota" onClick={saveClick} />}
					</Form>
				</div>
				<div>
					<NewNFT nftInProcess={nftInProcess} setNFTId={handlerNFTId} ownerName={ownerName} ownerId={ownerId}  birthDate={birthDate} description={description} name={name} />
				</div>
				
			</div>

			
		</GlobalContent>
	)
}
