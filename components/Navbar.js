import { useState, useEffect } from "react";
import { debounce } from "../utilities/debounce";
import SearchForm from "./SearchForm";

const Navbar = ({ rawFeed, setFilteredFeed, setTotalPage, setPageActive, setSearch, perPage, search, handleSearch, handleRemoveSearch, searchInput, setSearchInput }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);
  
  const handleScroll = debounce(() => {
    const currentScrollPos = window.pageYOffset;
    setPrevScrollPos(currentScrollPos)
    setVisible(currentScrollPos * -0.3 < -80 ? true : false)
  }, 100)

  const styles = {
    active: {
      visibility: "visible",
      transition: "all 0.5s"
    },
    hidden: {
      visibility: "hidden",
      transition: "all 0.5s",
      transform: "translateY(-100%)"
    }
  }
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, [prevScrollPos, visible, handleScroll]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm transition" style={visible === true ? styles.active: styles.hidden}>
      <div className="container">
        <a className="navbar-brand d-none d-md-block text-primary letter-spacing fw-bold">Flickr Public Feed</a>
        <div className="collapse navbar-collapse d-flex justify-content-end">
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
    </nav>
  )
}

export default Navbar