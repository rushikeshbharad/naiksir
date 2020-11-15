import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import { withRouter } from "next/router"
import ImageComp from "components/image"
import DropDown from "components/dropdown"
import SideBg from "components/sidebg"
import debounce from "lodash/debounce"
import queryString from "query-string"
import styles from "containers/index/index.module.scss"

const paintingsImported = [
  {
    url: "https://i.ibb.co/Tr2t5Xp/IMG-20160929-134240-HDR.jpg",
    caption: "Egyptian I",
    genre: "Egyptian",
    shade: "color",
    size: `18" X 18"`,
    medium: "Acrylics on canvas",
    orientation: "Square",
    keywords: "bird,mask,warrior,orange,blue,yellow"
  },
  {
    url: "https://i.ibb.co/QP2Ctgm/IMG-20160929-133825-BURST2.jpg",
    caption: "Egyptian II",
    genre: "Egyptian",
    shade: "color",
    size: `24" X 24"`,
    medium: "Acrylics on canvas",
    orientation: "Square",
    keywords: "couple,king,queen,throne,green,gown,skin,wall,wall painting"
  },
  {
    url: "https://i.ibb.co/kmsmN62/IMG-20170509-124829.jpg",
    caption: "Egyptian III",
    genre: "Egyptian",
    shade: "color",
    size: `20" X 14"`,
    medium: "Water color on handmade",
    orientation: "Horizontal",
    keywords: "green,blue,birds"
  },
  {
    url: "https://i.ibb.co/n0YCn0W/IMG-20180716-173243.jpg",
    caption: "Egyptian IV",
    genre: "Egyptian",
    shade: "color",
    size: `11" X 9"`,
    medium: "Water color on handmade",
    orientation: "Horizontal",
    keywords: "wolf"
  },
  {
    url: "https://i.ibb.co/PFXTLdC/IMG-20180716-173352.jpg",
    caption: "Egyptian V",
    genre: "Egyptian",
    shade: "color",
    size: `9" X 11"`,
    medium: "Water color on handmade",
    orientation: "Vertical",
    keywords: "bird,green"
  },
  {
    url: "https://i.ibb.co/5YYLJ4w/IMG-20180716-173727.jpg",
    caption: "Egyptian VI",
    genre: "Egyptian",
    shade: "color",
    size: `11" X 9"`,
    medium: "Water color on handmade",
    orientation: "Horizontal",
    keywords: "dog,bones,wall"
  }
]

const restrictEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

let GENRE = new Set()
let SHADE = new Set()
let SIZE = new Set()
let MEDIUM = new Set()
let ORIENTATION = new Set()

paintingsImported.forEach(({
  genre,
  shade,
  size,
  medium,
  orientation
}) => {
  GENRE.add(genre)
  SHADE.add(shade)
  SIZE.add(size)
  MEDIUM.add(medium)
  ORIENTATION.add(orientation)
})

GENRE = [...GENRE]
SHADE = [...SHADE]
SIZE = [...SIZE]
MEDIUM = [...MEDIUM]
ORIENTATION = [...ORIENTATION]

let clientX = 0
let clientY = 0

export default withRouter(function Home({ router }) {
  const [paintings, setPaintings] = useState(paintingsImported)
  const [selectedImage, setSelectImage] = useState(null)
  const [imageStyle, setImageStyle] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)
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
      left: popImage.current.offsetLeft - (xDiff * 2),
      top: popImage.current.offsetTop - (yDiff * 2)
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

  const {
    search = "",
    genre = "",
    shade = "",
    size = "",
    medium = "",
    orientation = ""
  } = router.query

  const handleQueryInRoute = (query) => {
    const createNewQuery = {
      search,
      genre,
      shade,
      size,
      medium,
      orientation,
      ...query
    }
    Object.keys(createNewQuery).forEach((key) => {
      if (!createNewQuery[key]) {
        delete createNewQuery[key]
      }
    })
    router.push(`?${queryString.stringify(createNewQuery)}`)
  }

  useEffect(() => {
    setSearchInput(search)
    const newPaintings = []
    paintingsImported.forEach((p) => {
      if (
        Object.values(p).some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        ) &&
        (!genre || p.genre.toLowerCase() === genre.toLowerCase()) &&
        (!shade || p.shade.toLowerCase() === shade.toLowerCase()) &&
        (!size || p.size.toLowerCase() === size.toLowerCase()) &&
        (!medium || p.medium.toLowerCase() === medium.toLowerCase()) &&
        (!orientation || p.orientation.toLowerCase() === orientation.toLowerCase())
      ) {
        newPaintings.push(p)
      }
    })
    setPaintings(newPaintings)
    if (genre || shade || size || medium || orientation) {
      setShowFilters(true)
    }
  }, [
    search,
    genre,
    shade,
    size,
    medium,
    orientation
  ])

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
          <div className={styles.profile}>
            <img
              className={styles.profileImage}
              src="/naiksir.jpeg"
              alt="Naik Sir"
            />
            <span className={styles.name}>
              {`Naik Sir's
              `}
              <samp>A</samp>
              <samp>r</samp>
              <samp>t</samp> <samp>G</samp>
              <samp>a</samp>
              <samp>l</samp>
              <samp>l</samp>
              <samp>e</samp>
              <samp>r</samp>
              <samp>y</samp>
            </span>
          </div>
          <div className={styles.searchAndFilter}>
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.which === 13) {
                    handleQueryInRoute({ search: e.currentTarget.value })
                  }
                }}
                placeholder="Search paintings"
              />
              <span
                className={styles.searchButton}
                onClick={() => {
                  if (searchInput) {
                    handleQueryInRoute({ search: "" })
                    setSearchInput("")
                  } else {
                    handleQueryInRoute({ search: searchInput })
                  }
                }}
              >
                {searchInput ? String.fromCharCode(9587) : (<>&#x1F50D;</>)}
              </span>
            </div>
            <div className={showFilters ? styles.filterBox : styles.filterBoxHide}>
              <DropDown
                options={GENRE.map((v) => ({ value: v, text: v }))}
                name="Genre"
                value={genre}
                onSelect={(v) => handleQueryInRoute({ genre: v })}
              />
              <DropDown
                options={SHADE.map((v) => ({ value: v, text: v }))}
                name="Shade"
                value={shade}
                onSelect={(v) => handleQueryInRoute({ shade: v })}
              />
              <DropDown
                options={SIZE.map((v) => ({ value: v, text: v }))}
                name="Size"
                value={size}
                onSelect={(v) => handleQueryInRoute({ size: v })}
              />
              <DropDown
                options={MEDIUM.map((v) => ({ value: v, text: v }))}
                name="Medium"
                value={medium}
                onSelect={(v) => handleQueryInRoute({ medium: v })}
              />
              <DropDown
                options={ORIENTATION.map((v) => ({ value: v, text: v }))}
                name="Orientation"
                value={orientation}
                onSelect={(v) => handleQueryInRoute({ orientation: v })}
              />
            </div>
            <span
              className={styles.filterLink}
              onClick={() => {
                if (showFilters) {
                  router.push("/")
                  setShowFilters(false)
                } else {
                  setShowFilters(true)
                }
              }}
            >
              {showFilters ? "Clear filters" : "Add search filters"}
            </span>
          </div>
        </nav>
        <main className={styles.main}>
          {paintings.map((params) =>
            <ImageComp
              key={params.caption}
              {...params}
              handleClick={handleImageClick}
            />
          )}
          {(!!search || !!genre || !!medium || !!shade || !!orientation || size) && (
            <span className={styles.count}>
              {`${paintings.length} results`}
            </span>
          )}
        </main>
        <footer className={styles.footer}>

        </footer>
        <SideBg />
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
})
