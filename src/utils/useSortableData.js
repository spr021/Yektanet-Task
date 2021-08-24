import { useEffect, useMemo, useState } from "react"

const useSortableData = (items, config = {bookMarks: []}) => {
  const [sortConfig, setSortConfig] = useState(config)
  const bookMarkList = JSON.parse(window.localStorage.getItem("book-mark")) || []

  const addToBookMark = (id) => {
    if([...sortConfig.bookMarks].includes(id)) {  
      setSortConfig({...sortConfig, bookMarks: [...sortConfig.bookMarks.filter(el => el !== id)]})
      ////
      window.localStorage.setItem("book-mark", JSON.stringify([...sortConfig.bookMarks.filter(el => el !== id)]))
    } else {
      setSortConfig({...sortConfig, bookMarks: [...sortConfig.bookMarks, id]})
      /////
      window.localStorage.setItem("book-mark", JSON.stringify([...sortConfig.bookMarks, id]))
    } 
  }
  
  const sortedItems = useMemo(() => {
    let sortableItems = [...items]
    // sort by table head
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
    // search by value
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
    // move book marks to up
    if (sortConfig.bookMarks) {
      sortConfig.bookMarks.forEach(bookMark => {
        sortableItems.sort((x,y) => { return x.id === bookMark ? -1 : y.id === bookMark ? 1 : 0 })
      })
    }
    return sortableItems
  }, [items, sortConfig])
  
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
    requestSort(URLsort, URLd)
    setSortConfig({...sortConfig, URLsort, URLd, bookMarks: bookMarkList})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return { items: sortedItems, requestSort, requestSearch, addToBookMark }
}

export default useSortableData