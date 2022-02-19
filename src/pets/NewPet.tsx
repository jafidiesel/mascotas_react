import React, { useEffect, useState } from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import "../styles.css"
import { deletePet, loadPet, newPet, savePet } from "./petsService"
import DangerLabel from "../common/components/DangerLabel"
import FormInput from "../common/components/FormInput"
import FormButtonBar from "../common/components/FormButtonBar"
import FormButton from "../common/components/FormButton"
import FormWarnButton from "../common/components/FormWarnButton"
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
	const [petId, setPetId] = useState("")
	const [name, setName] = useState("")
	const [ownerName, setOwnerName] = useState("")
	const [ownerDNI, setOwnerDNI] = useState("")
	const [nftId, setNFTId] = useState("")
	const [nftInProcess, setNFTInProcess] = useState(false)
	
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

	const handlerNFTProcess = (flag: boolean) => {
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
			if (petId) {
				await savePet({ id: petId, name, birthDate, description, nftId: "1" })
			} else {
				
				// call here for the NFT creation?
				// or maybe the NFT component should have a method prop to call it when 
				// the "create pet" process begins

				// this "create pet"  process consist on unlocking and connecting to the account, 
				// creating the NFT, look for the creation txn and obtain the asset id
				// and save the pet on the pet system with the NFT id


				await newPet({ name, birthDate, description: description, nftId: nftId })
			}
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
							disabled={nftInProcess}
						/>
						<FormInput
							label="Descripción"
							name="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess}
						/>
						<FormInput
							label="Fecha de Nacimiento"
							name="birthDate"
							value={birthDate}
							onChange={(event) => setBirthDate(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess}
						/>
						<div className="row-elements-start">
							<FormLabel text={nftId} label="NFT Id" /> 
							{ !!nftId && <FontAwesomeIcon size="2x" icon={faCheckCircle} className="mx-2" color="green"/>}
						</div>





						<hr></hr>
						<h4>Datos del dueño:</h4>
						<FormInput
							label="Nombre y Apellido"
							name="nameLastname"
							value={ownerName}
							onChange={(event) => setOwnerName(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess}
						/>
						<FormInput
							label="DNI"
							name="dni"
							value={ownerDNI}
							onChange={(event) => setOwnerDNI(event.target.value)}
							errorHandler={errorHandler}
							disabled={nftInProcess}
						/>


						<DangerLabel message={errorHandler.errorMessage} />
						<FormButtonBar>
							<div>
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
							</div>
							<FormWarnButton
								hidden={!petId}
								label="Eliminar"
								onClick={deleteClick}
								/>
							<FormButton label="Cancelar" onClick={() => goHome(props)} />
						</FormButtonBar>
						<br></br>
						{nftId && <FormContentButton className="btn btn-success" content="Guardar mascota" onClick={saveClick} />}
					</Form>
				</div>
				<div>
					<NewNFT nftInProcess={nftInProcess} setNFTId={handlerNFTId} ownerName={ownerName} ownerDNI={ownerDNI}  birthDate={birthDate} description={description} name={name} />
				</div>
				
			</div>

			
		</GlobalContent>
	)
}
