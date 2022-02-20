import React from "react"
import { ErrorHandler } from "../utils/ErrorHandler"
import ErrorLabel from "./ErrorLabel"

export default function FormInput(props: {
  label?: string
  name: string
  errorHandler: ErrorHandler
  value?: string | undefined
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
}) {
  return (
    <div className="form-group">
      {props.label &&<label>{props.label}</label>}
      <input
        id={props.name}
        type="text"
        value={props.value}
        onChange={props.onChange}
        className={props.errorHandler.getErrorClass(props.name, "form-control")}
        disabled={props.disabled}
      ></input>
      <ErrorLabel message={props.errorHandler.getErrorText(props.name)} />
    </div>
  )
}
