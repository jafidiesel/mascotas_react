import React from "react"

export default function FormAcceptButton(props: {
  label: string
  disabled?: boolean
  onClick: () => any
}) {
  return (
    <button className="btn btn-primary" onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  )
}
