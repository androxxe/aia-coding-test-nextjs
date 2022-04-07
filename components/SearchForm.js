import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useRouter } from 'next/router'

const FormSearch = ({ perPage, setFilteredFeed, rawFeed, setTotalPage, setPageActive, searchInput, search, setSearch, setSearchInput }) => {
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    
    setSearch(searchInput)

    let tempFilteredFeed
    tempFilteredFeed = {...rawFeed, items: rawFeed.items.filter(
      item => {
        return (
          item
          .title
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
          item
          .description
          .toLowerCase()
          .includes(searchInput.toLowerCase())
        );
      })}

    setFilteredFeed(tempFilteredFeed)
    setTotalPage(Math.ceil(tempFilteredFeed.items.length / perPage))
    setPageActive(1)
    router.push('?page=' + 1)
  }

  const handleRemoveSearch = () => {
    setSearch('')
    setSearchInput('')
    setFilteredFeed(rawFeed)
    setTotalPage(Math.ceil(rawFeed.items.length / perPage))
  }
  
  return (
    <form onSubmit={handleSearch} className="d-flex flex-row align-items-center justify-content-center">
      <div className="input-group border rounded-pill z-index-100">
        <span className="input-group-text bg-white border-0 rounded-pill" id="basic-addon1">
          <FontAwesomeIcon icon={faSearch} width={16} height={16} />
        </span>
        <input className="form-control border-0 rounded-pill" name="" placeholder="Search something.." value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
        { search ? 
          <span className="input-group-text bg-white border-0 rounded-pill">
            <FontAwesomeIcon onClick={handleRemoveSearch} className="pointer text-danger" icon={faClose} width={16} height={16} />
          </span>
        : null }
      </div>
      <button className="btn btn-primary ms-2 rounded-pill" type="submit">Search</button>
    </form>
  )
}

export default FormSearch