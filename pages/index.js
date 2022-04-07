import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faSearch, faU, faUser } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Gallery from 'react-photo-gallery';
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Home() {
  const router = useRouter()

  // public feed data
  const [rawFeed, setRawFeed] = useState([])
  const [filteredFeed, setFilteredFeed] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const perPage = 10;
  const [pageActive, setPageActive] = useState(1) // what current page active
  const [totalPage, setTotalPage] = useState(1) // total page exist
  const [searchField, setSearchField] = useState('') // search value from input
  const [search, setSearch] = useState('') // search value from input
  
  useEffect(() => {
    fetchFeed()
  }, [])

  useEffect(() => {
    if(rawFeed.items?.length > 0){
      if(router.query.page){
        setPageActive(router.query.page)
      } else {
        setPageActive(1)
      }
      setTotalPage(Math.ceil(rawFeed.items.length / perPage))
    }
  }, [rawFeed]);

  const fetchFeed = async () => {
    try {
      const { data, status, message, status_code } = await axios.get('http://localhost:5000')
      setRawFeed(data.data.photos)
      setFilteredFeed(data.data.photos)
      setIsLoading(false)
    } catch (e) {
      toast.error(e.message, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  const handleChangePage = (page) => {
    if(page != 0 && page <= totalPage){
      setPageActive(page)
      router.push('?page=' + page)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchField)

    let tempFilteredFeed
    tempFilteredFeed = {...rawFeed, items: rawFeed.items.filter(
      item => {
        return (
          item
          .title
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
          item
          .description
          .toLowerCase()
          .includes(searchField.toLowerCase())
        );
      })}

    setFilteredFeed(tempFilteredFeed)
    setTotalPage(Math.ceil(tempFilteredFeed.items.length / perPage))
    setPageActive(1)
  }

  const handleRemoveSearch = () => {
    setSearch('')
    setSearchField('')
    setFilteredFeed(rawFeed)
  }

  const Pagination = () => {
    var element = []
    for(let i = 0; i < totalPage; i++){
      let page = i + 1
      element.push(
        <li key={`li_${i}`} className={ pageActive == page ? 'page-item pointer active' : 'page-item pointer'}>
          <a className="page-link pe-auto" onClick={() => handleChangePage(page)}>{ page }</a>
        </li>
      )
    }

    return element
  }

  const imageRenderer = useCallback(
    ({ index, left, top, key, photo, filteredFeed }) => {
      const item = filteredFeed.items[index]
      return (
        <div key={`gallery_${index}`} className="image-gallery position-relative pb-4 mb-3">
          {/* <a href={item.link} target="_blank" className="image-shadow" rel="noreferrer"> */}
            <div className="position-relative" 
              // onMouseEnter={(event) => {
              //   event.target.className = 'bg-success'
              // }}
              // onMouseLeave={(event) => {
              //   event.target.className = ''
              // }}
            >
              {/* <div className="image-shadow position-absolute start-0 top-0 w-100 h-100"></div> */}
              <div style={{
                width: photo.width,
                height: photo.height,
                backgroundImage: `url(${photo.src})`,
                backgroundSize: 'cover'
              }} />
              {/* <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
              /> */}
              <div className="position-absolute bottom-0 start-0 px-2 z-index-100">
                <p className="two-line-text mb-0 text-white fw-bold text-shadow">{ item.title }</p>
                <p className="text-light text-xsm d-flex align-items-center text-shadow">
                  <FontAwesomeIcon className="me-1" icon={faUser} width={10} height={10} /> 
                  { item.author }
                </p>
              </div>
            </div>
            <div className="one-line-text position-absolute bottom-0 start-0 w-100 text-xsm text-secondary" dangerouslySetInnerHTML={{ __html: item.description }} />
          {/* </a> */}
        </div>
      )
    },
    []
  );

  return (
    <div>
      <Head>
        <title>AIA Coding Test - Andrio Pratama - Next.js</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <main className="my-5 container">
        <ToastContainer />
        <div className="row">
          <div className="col-md-8">
            <h1 className="text-start text-success fw-bolder fs-1">Flickr Public Feed</h1>
            <p className="fst-italic text-secondary">Enjoy photos from flickr public feed API here <font className="fst-normal">😌</font></p>
          </div>
          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <form onSubmit={handleSearch} className="d-flex flex-row mb-3">
              <div className="input-group border rounded-pill z-index-100">
                <span className="input-group-text bg-white border-0 rounded-pill" id="basic-addon1">
                  <FontAwesomeIcon icon={faSearch} width={16} height={16} />
                </span>
                <input className="form-control border-0 rounded-pill" name="" placeholder="Search something.." value={searchField} onChange={(event) => setSearchField(event.target.value)} />
                { search ? 
                  <span className="input-group-text bg-white border-0 rounded-pill">
                    <FontAwesomeIcon onClick={handleRemoveSearch} className="pointer text-danger" icon={faClose} width={16} height={16} />
                  </span>
                : null }
              </div>
              <button className="btn btn-primary ms-2 rounded-pill" type="submit">Search</button>
            </form>
          </div>
        </div>
        { isLoading ? 
          <LoadingSkeleton />
        : 
          <div>
            <div className="row mb-3">
              
            </div>
            { search ? 
              <div className="mx-3">
                <p>Results for <b>{ search }</b></p>
              </div>
            : null }
            <Gallery renderImage={(item) => imageRenderer({...item, filteredFeed})} photos={filteredFeed.items.slice((pageActive - 1) * perPage, perPage * pageActive)} />
            <div className="d-flex justify-content-end mt-5">
              <nav aria-label="Pagination">
                <ul className="pagination">
                  <li className={ pageActive == 1 ? 'page-item pointer disabled' : 'page-item pointer' }>
                    <span className="page-link pe-auto" onClick={() => handleChangePage(pageActive - 1)}>Prev</span>
                  </li>
                  <Pagination />
                  <li className={ pageActive == totalPage ? 'page-item pointer disabled' : 'page-item pointer' }>
                    <a className="page-link pe-auto" onClick={() => handleChangePage(pageActive + 1)}>Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        }
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
