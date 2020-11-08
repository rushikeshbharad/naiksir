import React, { useState } from "react"
import styles from "./index.module.scss"

const noop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

const DropDown = ({ options, value, onSelect, name }) => {
  const [show, setShow] = useState(false)
  const primaryValue = value || name
  return (
    <div
      className={styles.dropDownHolder}
      onBlur={() => setShow(false)}
      onCut={noop}
      onCopy={noop}
      onPaste={noop}
      onKeyDown={noop}
      contentEditable
      suppressContentEditableWarning
    >
      <div
        className={show ? styles.primaryValue : styles.primaryValueShowing}
        onClick={() => setShow(!show)}
      >
        {primaryValue}
      </div>
      {show && (
        <div className={styles.valuesHolder}>
          {!!value && (
            <div
              className={styles.title}
              onClick={() => {
                setShow(false)
                onSelect("")
              }}
            >
              {name}
            </div>
          )}
          {options.map(({ value: v, text }) => (
            <div
              className={styles.value}
              onClick={() => {
                setShow(false)
                onSelect(v)
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropDown
