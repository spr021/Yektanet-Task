import { useEffect, useMemo, useState } from "react"

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config)
  
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
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const URLsort = params.get('sort')
    const URLd = params.get('d')
    setSortConfig({ URLsort, URLd })
    requestSort(URLsort, URLd)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return { items: sortedItems, requestSort }
}

export default useSortableData