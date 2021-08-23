import { useEffect, useMemo, useState } from "react"

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config)
  const [bookMark, setBookMark] = useState([])

  const bookMarkList = (id) => {
    let BookMark = JSON.parse(window.localStorage.getItem("book-mark")) || []
    BookMark.includes(id) ? BookMark = BookMark.filter(el => el !== id) : BookMark.push(id)
    window.localStorage.setItem("book-mark", JSON.stringify(BookMark))
    setBookMark(BookMark)
  }
  
  const sortedItems = useMemo(() => {
    let sortableItems = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    bookMark &&
    bookMark.forEach(bookMark => {
      sortableItems.sort((x,y) => { return x.id === bookMark ? -1 : y.id === bookMark ? 1 : 0; });
    })
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
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const URLsort = params.get('sort')
    const URLd = params.get('d')
    setSortConfig({ URLsort, URLd })
    requestSort(URLsort, URLd)
    JSON.parse(window.localStorage.getItem("book-mark")) &&
    setBookMark(JSON.parse(window.localStorage.getItem("book-mark")))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return { items: sortedItems, requestSort, bookMarkList }
}

export default useSortableData