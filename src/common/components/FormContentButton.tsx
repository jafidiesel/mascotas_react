import React from "react"

export default function FormContentButton(props: {
  content: React.ReactNode
  onClick: () => any
  disabled?: boolean
  className?: string
}) {
  return (
    <button className={props.className ? props.className : "btn btn-dark"} onClick={props.onClick} disabled={props.disabled} >
      {props.content}
    </button>
  )
}
