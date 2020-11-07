import React, { useRef } from "react"
import styles from "./index.module.scss"

function getOffset( el ) {
  let _x = 0;
  let _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

const Image = ({
  url,
  caption,
  genre,
  shade,
  size,
  medium,
  orientation,
  handleClick
}) => {
  const imgRef = useRef(null)

  const handleOverlayClick = () => {
    const top = imgRef.current.y
    const left = imgRef.current.x
    const width = imgRef.current.width
    const height = imgRef.current.height
    const naturalHeight = imgRef.current.naturalHeight
    const naturalWidth = imgRef.current.naturalWidth

    handleClick({
      url,
      caption,
      width,
      height,
      top,
      left,
      naturalHeight,
      naturalWidth
    })
  }

  return (
    <div className={styles.imageTile}>
      <img ref={imgRef} src={url} alt={caption} />
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.infoCard}>
          <span className={styles.info}>{`${genre} - ${shade} - ${size} - ${medium} - ${orientation}`}</span>
          <span className={styles.caption}>{caption}</span>
        </div>
        <div className={styles.borderTop} />
        <div className={styles.borderBottom} />
        <div className={styles.borderLeft} />
        <div className={styles.borderRight} />
      </div>
    </div>
  )
}

export default Image
