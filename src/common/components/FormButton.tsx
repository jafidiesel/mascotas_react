import React from "react"

export default function FormButton(props: {
  label: string
  onClick: () => any
  disabled?: boolean
}) {
  return (
    <button className="btn btn-dark" onClick={props.onClick} disabled={props.disabled} >
      {props.label}
    </button>
  )
}
