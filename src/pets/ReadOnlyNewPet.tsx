import React from "react"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import "../styles.css"
import FormInput from "../common/components/FormInput"
import FormTitle from "../common/components/FormTitle"
import Form from "../common/components/Form"
import GlobalContent from "../common/components/GlobalContent"

import FormLabel from "../common/components/FormLabel"

import './styles.css'

interface ReadOnlyNewPetProps {
	birthDate: string,
	description: string,
	id: string,
	name: string,
	nftId: string,
	ownerId: string,
	ownerName: string
}

export default function ReadOnlyNewPet(props: ReadOnlyNewPetProps) {
	const errorHandler = useErrorHandler()

	return (
		<GlobalContent>
			<div className="columns">
				<div>
					<FormTitle>Mascota Registrada</FormTitle>
					<h4>Datos de la mascota:</h4>
					<Form>
						<FormInput
							label="Nombre *"
							name="name"
							value={props.name}
							onChange={() => { }}
							errorHandler={errorHandler}
							disabled
						/>
						<FormInput
							label="Descripción *"
							name="description"
							value={props.description}
							onChange={() => { }}
							errorHandler={errorHandler}
							disabled
						/>
						<FormInput
							label="Fecha de Nacimiento *"
							name="birthDate"
							value={props.birthDate}
							onChange={() => { }}
							errorHandler={errorHandler}
							disabled
						/>
						<div className="row-elements-start">
							<FormLabel text={props.nftId} label="NFT Id" />
						</div>

						<hr></hr>
						<h4>Datos del dueño:</h4>
						<FormInput
							label="Nombre y Apellido *"
							name="nameLastname"
							value={props.ownerName}
							onChange={() => { }}
							errorHandler={errorHandler}
							disabled
						/>
						<FormInput
							label="DNI *"
							name="dni"
							value={props.ownerId}
							onChange={() => { }}
							errorHandler={errorHandler}
							disabled
						/>
					</Form>
				</div>
			</div>
		</GlobalContent>
	)
}
