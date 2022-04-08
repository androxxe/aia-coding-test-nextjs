import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Gallery from 'react-photo-gallery';
import LoadingSkeleton from '../components/LoadingSkeleton'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import SearchForm from '../components/SearchForm'

export default function Home() {
  const router = useRouter()

  const perPage = 10; // feed per page for pagination
  
  // public feed data
  const [rawFeed, setRawFeed] = useState([]) // raw feed data to restore after feed filtered (so we dont need to fetch again)
  const [filteredFeed, setFilteredFeed] = useState([]) // data that exactly we render to user

  const [isLoading, setIsLoading] = useState(true) // loading state
  
  const [pageActive, setPageActive] = useState(1) // what current page active
  const [totalPage, setTotalPage] = useState(1) // total page exist

  // search state declared here, not in search form. so state can be used on "search form" on navbar and "search form" on right side
  // we can also implement redux for this situation 
  const [searchInput, setSearchInput] = useState('') // search value from input
  const [search, setSearch] = useState('') // search value 
  
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
  }, [rawFeed])


  const fetchFeed = async () => {
    try {
      const { data } = await axios.get('/api/flickr-feed')

      if(data.status == 1){
        setRawFeed(data.data.photos)
        setFilteredFeed(data.data.photos)
        setIsLoading(false)
      } else {
        toast.error(`${data.status_code} - ${data.message}`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
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

  const NumberPagination = () => {
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
          <a href={item.link} target="_blank" rel="noreferrer">
            <div className="position-relative">
            <div className="image-shadow position-absolute start-0 top-0 w-100 h-100"></div>
              <Image 
                src={photo.src}
                width={photo.width}
                height={photo.height}
                placeholder='blur'
                blurDataURL='/images/loading-image.jpg'
              />
              <div className="position-absolute bottom-0 start-0 px-2 z-index-100">
                <p className="two-line-text mb-0 text-white fw-bold text-shadow fs-7">{ item.title }</p>
                <p className="text-light text-xsm d-flex align-items-center text-shadow">
                  <FontAwesomeIcon className="me-1" icon={faUser} width={10} height={10} /> 
                  { item.author }
                </p>
              </div>
            </div>
            <div className="one-line-text position-absolute bottom-0 start-0 w-100 text-xsm text-secondary" dangerouslySetInnerHTML={{ __html: item.description }} />
          </a>
        </div>
      )
    },
    []
  );

  return (
    <div className="bg-light">
      <Head>
        <title>AIA Coding Test - Andrio Pratama - Next.js</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AIA Coding Test - Andrio"/>
        <meta name="keywords" content="Andrio Pratama Sirait, React.js, Next.js, AIA Coding Test"/>
        <meta name="author" content="Andrio Pratama Sirait"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="py-5 container">
        <Navbar 
          rawFeed={rawFeed}
          setFilteredFeed={setFilteredFeed}
          setTotalPage={setTotalPage}
          setPageActive={setPageActive}
          searchInput={searchInput}
          search={search}
          setSearchInput={setSearchInput}
          setSearch={setSearch}
          perPage={perPage}
        />
        <ToastContainer />
        <div className="row mb-4">
          <div className="col-md-8">
            {/* Start Title */}
            <h1 className="text-start text-primary fw-bold fs-2 letter-spacing">Flickr Public Feed</h1>
            <p className="fst-italic text-secondary">Enjoy photos from flickr public feed API here <font className="fst-normal">😌</font></p>
            {/* End Title */}
          </div>
          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <SearchForm 
              rawFeed={rawFeed}
              setFilteredFeed={setFilteredFeed}
              setTotalPage={setTotalPage}
              setPageActive={setPageActive}
              searchInput={searchInput}
              search={search}
              setSearchInput={setSearchInput}
              setSearch={setSearch}
              perPage={perPage}
            />
          </div>
        </div>
        { isLoading ? 
          <LoadingSkeleton />
        : 
          <div>
            { search ? 
              <div className="mx-3">
                <p>Results for <b>{ search }</b></p>
              </div>
            : null }

            { filteredFeed.items.length > 0 ?
              // Grid Gallery if feed exist
              <Gallery renderImage={(item) => imageRenderer({...item, filteredFeed})} photos={filteredFeed.items.slice((pageActive - 1) * perPage, perPage * pageActive)} />
            : 
              // Show empty icons
              <div className="text-center my-5">
                <Image 
                  src="/images/no-data.png"
                  width={150}
                  height={150}
                />
                <p>Sorry, no data found!</p>
              </div>
            }
            
            {/* Start Pagination View */}
            <div className="d-flex justify-content-end mt-5">
              <nav aria-label="Pagination">
                <ul className="pagination">
                  <li className={ pageActive == 1 ? 'page-item pointer disabled' : 'page-item pointer' }>
                    <span className="page-link pe-auto" onClick={() => handleChangePage(pageActive - 1)}>Prev</span>
                  </li>
                  <NumberPagination />
                  <li className={ pageActive == totalPage ? 'page-item pointer disabled' : 'page-item pointer' }>
                    <a className="page-link pe-auto" onClick={() => handleChangePage(pageActive + 1)}>Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            {/* End Pagination View */}
          </div>
        }
      </main>
      <footer className="d-flex justify-content-around flex-row px-5 py-5 border-top container">
        <div className="d-flex flex-row justify-content-center align-items-center">
          Powered by{' '}
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            <span>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center">
          by
          <a 
            href="https://andriosirait.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ms-1"
          >
            Andrio Sirait
          </a>
        </div>
      </footer>
    </div>
  )
}

// export async function getStaticProps() {
//   // Call an external API endpoint to get feed
//   const { data } = await axios.get('http://localhost:5000')

//   return {
//     props: {
//       feeds: data,
//     },
//   }
// }