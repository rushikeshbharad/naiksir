import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import ImageComp from "components/image"
import debounce from "lodash/debounce"
import styles from "containers/index/index.module.scss"

const paintings = [
  {
    url: "https://i.ibb.co/rxR9GFS/painting1.jpg",
    caption: "Sunset",
    genre: "Nature",
    shade: "masta",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/ncz8P6L/painting2.jpg",
    caption: "Umbrella",
    genre: "Rainy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/qpMWDKP/painting3.jpg",
    caption: "Balloons",
    genre: "Happy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/C9Rkt9F/painting4.jpg",
    caption: "Tree",
    genre: "Abstract",
    shade: "colors",
    size: "1.25ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/pP1XCjb/painting5.jpg",
    caption: "Cow boy",
    genre: "People",
    shade: "colors",
    size: "2ft X 1.5ft",
    medium: "Oil paint on canvas",
    orientation: "Horizontal"
  },
  {
    url: "https://i.ibb.co/rxR9GFS/painting1.jpg",
    caption: "Sunset2",
    genre: "Nature",
    shade: "masta",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/ncz8P6L/painting2.jpg",
    caption: "Umbrella2",
    genre: "Rainy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/qpMWDKP/painting3.jpg",
    caption: "Balloons2",
    genre: "Happy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/C9Rkt9F/painting4.jpg",
    caption: "Tree2",
    genre: "Abstract",
    shade: "colors",
    size: "1.25ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/pP1XCjb/painting5.jpg",
    caption: "Cow boy2",
    genre: "People",
    shade: "colors",
    size: "2ft X 1.5ft",
    medium: "Oil paint on canvas",
    orientation: "Horizontal"
  },
  {
    url: "https://i.ibb.co/rxR9GFS/painting1.jpg",
    caption: "Sunset3",
    genre: "Nature",
    shade: "masta",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/ncz8P6L/painting2.jpg",
    caption: "Umbrella3",
    genre: "Rainy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/qpMWDKP/painting3.jpg",
    caption: "Balloons3",
    genre: "Happy",
    shade: "colors",
    size: "1.5ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/C9Rkt9F/painting4.jpg",
    caption: "Tree3",
    genre: "Abstract",
    shade: "colors",
    size: "1.25ft X 2ft",
    medium: "Oil paint on canvas",
    orientation: "Vertical"
  },
  {
    url: "https://i.ibb.co/pP1XCjb/painting5.jpg",
    caption: "Cow boy3",
    genre: "People",
    shade: "colors",
    size: "2ft X 1.5ft",
    medium: "Oil paint on canvas",
    orientation: "Horizontal"
  }
]

const restrictEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

let clientX = 0
let clientY = 0

export default function Home() {
  const [selectedImage, setSelectImage] = useState(null)
  const [imageStyle, setImageStyle] = useState(null)
  const popImage = useRef(null)

  const handleDrop = (event) => {
    if (!event?.clientX || !event?.clientY) {
      return
    }
    const xDiff = clientX - event.clientX
    const yDiff = clientY - event.clientY
    clientX = event.clientX
    clientY = event.clientY
    setImageStyle({
      ...imageStyle,
      left: popImage.current.offsetLeft - xDiff,
      top: popImage.current.offsetTop - yDiff
    })
  }

  useEffect(() => {
    document.addEventListener("keydown", function(event) {
      const key = event.key; // Or const {key} = event; in ES6+
      if (key === "Escape") {
        setSelectImage(null)
      }
    })
  }, [])

  useEffect(() => {
    if (selectedImage) {
      setImageStyle({
        height: selectedImage.height,
        width: selectedImage.width,
        top: selectedImage.top,
        left: selectedImage.left
      })
    } else {
      setImageStyle(null)
    }
  }, [selectedImage])

  const handleImageClick = ({
    url,
    caption,
    width,
    height,
    top,
    left,
    naturalHeight,
    naturalWidth
  }) => {
    setSelectImage({ url, caption, top, left, width, height })
    const heightMultiple = 0.7 * window.innerHeight / naturalHeight
    const widthMultiple = 0.7 * window.innerWidth / naturalWidth
    const minMultiple = heightMultiple < widthMultiple ?
      heightMultiple :
      widthMultiple
    const newWidth = naturalWidth * minMultiple
    const newHeight = naturalHeight * minMultiple
    const newTop = (window.innerHeight - newHeight) / 2
    const newLeft = (window.innerWidth - newWidth) / 2

    setTimeout(() => {
      setSelectImage({
        url,
        caption,
        top: newTop,
        left: newLeft,
        width: newWidth,
        height: newHeight,
        expand: true
      })
    }, 500)
  }

  const magnify = (plus) => {
    let { width, height, top, left, ...rem } = imageStyle
    const aspectRatio = width / height
    const amount = 256 * (plus ? 1 : -1)
    const newWidth = amount + width
    const newHeight = newWidth / aspectRatio
    const newTop = top - (newHeight - height) / 2
    const newLeft = left - amount / 2

    if (newWidth > 100 && newWidth < (window.innerWidth * 2)) {
      setImageStyle({
        ...rem,
        width: newWidth,
        height: newHeight,
        top: newTop,
        left: newLeft
      })
    }
  }

  const debouncedHandleDrop = debounce((...args) => handleDrop(...args), 100, { maxWait: 300 })

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Naik Sir | Art</title>
          <link rel="icon" href="/naiksirfav.ico" />
        </Head>
        <nav className={styles.nav}>

        </nav>
        <main className={styles.main}>
          {paintings.map((params) =>
            <ImageComp
              key={params.caption}
              {...params}
              handleClick={handleImageClick}
            />
          )}
        </main>
        <footer className={styles.footer}>

        </footer>
      </div>
      {selectedImage && (
        <div
          className={styles.popImageContainer}
          onClick={() => {
            setSelectImage(null)
          }}
        >
          <img
            ref={popImage}
            draggable
            onDragStart={(event) => {
              clientX = event.clientX
              clientY = event.clientY
            }}
            onDrag={debouncedHandleDrop}
            onDragOver={restrictEvent}
            onClick={restrictEvent}
            src={selectedImage.url}
            alt={selectedImage.caption}
            style={imageStyle}
          />
          <div
            className={styles.magnifier}
            onClick={restrictEvent}
          >
            <div
              onClick={(e) => {
                restrictEvent(e)
                magnify(false)
              }}
            >
              &#x2796;
            </div>
            <div
              onClick={(e) => {
                restrictEvent(e)
                magnify(true)
              }}
            >
              &#x2795;
            </div>
          </div>
        </div>
      )}
    </>
  )
}
