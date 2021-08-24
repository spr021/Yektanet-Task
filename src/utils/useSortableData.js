import { useEffect, useMemo, useState } from "react"

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config)
  const [bookMark, setBookMark] = useState([])
  console.log(sortConfig)

  const bookMarkList = (id) => {
    let BookMark = JSON.parse(window.localStorage.getItem("book-mark")) || []
    BookMark.includes(id) ? BookMark = BookMark.filter(el => el !== id) : BookMark.push(id)
    window.localStorage.setItem("book-mark", JSON.stringify(BookMark))
    setBookMark(BookMark)
  }
  
  const sortedItems = useMemo(() => {
    let sortableItems = [...items]
    if (sortConfig !== null && sortConfig.key !== null) {
      sortableItems
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    if (sortConfig !== null && sortConfig.search && sortConfig.value) {
      sortableItems = sortableItems
      .filter(item => {
        return item[sortConfig.search].toLowerCase().includes(sortConfig.value.toLowerCase())
      })
      .sort((a, b) => {
        if(a[sortConfig.search].toLowerCase().indexOf(sortConfig.value.toLowerCase()) > b[sortConfig.search].toLowerCase().indexOf(sortConfig.value.toLowerCase())) {
          return 1
        } else if (a[sortConfig.search].toLowerCase().indexOf(sortConfig.value.toLowerCase()) < b[sortConfig.search].toLowerCase().indexOf(sortConfig.value.toLowerCase())) {
            return -1
        } else {
            if(a[sortConfig.search] > b[sortConfig.search])
              return 1
            else
              return -1
        }
      })
    }
    
    if(bookMark) {
      bookMark.forEach(bookMark => {
        sortableItems.sort((x,y) => { return x.id === bookMark ? -1 : y.id === bookMark ? 1 : 0 })
      })
    }
    return sortableItems
  }, [items, sortConfig, bookMark])
  
  const requestSort = (key, direction) => {
    direction = direction || "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    const params = new URLSearchParams(window.location.search)
    params.set("sort", key)
    params.set("d", direction)
    const URL = params.toString().indexOf("null") > 0 ? `${window.location.pathname}` : `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, "", URL)
    setSortConfig({...sortConfig, key, direction })
  }

  const requestSearch = (search, value) => {
    setSortConfig({...sortConfig, search, value })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const URLsort = params.get('sort')
    const URLd = params.get('d')
    setSortConfig({...sortConfig, URLsort, URLd })
    requestSort(URLsort, URLd)
    JSON.parse(window.localStorage.getItem("book-mark")) &&
    setBookMark(JSON.parse(window.localStorage.getItem("book-mark")))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return { items: sortedItems, requestSort, requestSearch, bookMarkList }
}

export default useSortableData