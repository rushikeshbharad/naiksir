import React from "react"
import styles from "./index.module.scss"

const images = [
  styles.acrylics,
  styles.brush,
  styles.canvas,
  styles.colorPalette,
  styles.dholak,
  styles.drumSet,
  styles.pencil,
  styles.tabla
]

const allAssets = [...images]
const leftAssets = []
const rightAssets = []
for (let i = 0; i < images.length; i += 1) {
  if (i % 2) {
    leftAssets.push(...allAssets.splice(Math.floor(Math.random()*allAssets.length), 1))
  } else {
    rightAssets.push(...allAssets.splice(Math.floor(Math.random()*allAssets.length), 1))
  }
}

const SideBg = () => {

  return (
    <>
      <div className={styles.leftBg}>
        {leftAssets.map((className) => <div className={className} />)}
      </div>
      <div className={styles.rightBg}>
        {rightAssets.map((className) => <div className={className} />)}
      </div>
    </>
  )
}

export default SideBg
