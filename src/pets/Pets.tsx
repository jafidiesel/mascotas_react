import React, { useState, useEffect } from "react"
import { Pet, loadPets } from "./petsService"
import "../styles.css"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import FormButtonBar from "../common/components/FormButtonBar"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormTitle from "../common/components/FormTitle"
import GlobalContent from "../common/components/GlobalContent"
import { RouteComponentProps } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { getAssetUrl } from "../nft/nftService"

export default function Pets(props: RouteComponentProps) {
	const [pets, setPets] = useState<Pet[]>([])

	const errorHandler = useErrorHandler()

	const loadCurrentPets = async () => {
		try {
			const result = await loadPets()
			setPets(result)
		} catch (error: any) {
			errorHandler.processRestValidations(error)
		}
	}

	const editPetClick = (petId: string) => {
		props.history.push("/editPet/" + petId)
	}

	const newPetClick = () => {
		props.history.push("/newPet")
	}

	useEffect(() => {
		void loadCurrentPets()
	}, [])

	return (
		<GlobalContent>
			<FormTitle>Mascotas</FormTitle>
			<table id="mascotas" className="table">
				<thead>
					<tr>
						<th> Nombre </th>
						<th> Descripción </th>
						<th> NFT ID </th>
						<th> </th>
					</tr>
				</thead>
				<tbody>
					{pets.map((pet, i) => {
						return (
							<tr key={i}>
								<td>{pet.name}</td>
								<td>{pet.description}</td>
								{
									pet.nftId
										? <td>
											<a href={getAssetUrl(pet.nftId)} target="_blank" rel="noopener noreferrer" >
												#{pet.nftId} on Algoexplorer <FontAwesomeIcon icon={faExternalLink} color="blue" />
											</a>
										</td>
										: <td>No NFT asociated</td>
								}

								<td className="text">
									<img
										src="/assets/edit.png"
										alt=""
										onClick={() => editPetClick(pet.id)}
									/>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>

			<FormButtonBar>
				<FormAcceptButton label="Nueva Mascota" onClick={newPetClick} />
				<FormButton label="Cancelar" onClick={() => goHome(props)} />
			</FormButtonBar>
		</GlobalContent>
	)
}

