import { AD_NAME, DATE, FIELD, MODIFIER_NAME, NEW_VALUE, OLD_VALUE } from '../../constant/strings'
import './Table.css'
import Data from "../../constant/data.json"
import { useEffect, useState } from 'react'
import useSortableData from '../../utils/useSortableData'

function Table() {
  const [listSize, setListSize] = useState(5)
  const { items, requestSort, bookMarkList } = useSortableData(Data)
  const bookMarkm = JSON.parse(window.localStorage.getItem("book-mark")) || []
  
  const params = new URLSearchParams(window.location.search)
  const URLsort = params.get('sort')
  const URLd = params.get('d')

  let Icon = () => URLd === "ascending" ? <span>&#8607;</span> : URLd === "descending" ? <span>&#8609;</span> : <span>&nbsp;</span>
  
  useEffect(() => {
    window.addEventListener('scroll',()=>{
      if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        setListSize(listSize + 10)
      }
    })
    return(
      window.removeEventListener("scroll", () => {})
    )
  },[listSize])

  return (
    <table>
      <thead>
        <tr className="table-head">
          <td onClick={() => requestSort('name')}>{MODIFIER_NAME} {URLsort === "name" && <Icon />}</td>
          <td onClick={() => requestSort('date')}>{DATE} {URLsort === "date" && <Icon />}</td>
          <td onClick={() => requestSort('title')}>{AD_NAME} {URLsort === "title" && <Icon />}</td>
          <td onClick={() => requestSort('field')}>{FIELD} {URLsort === "field" && <Icon />}</td>
          <td onClick={() => requestSort('old_value')}>{OLD_VALUE} {URLsort === "old_value" && <Icon />}</td>
          <td onClick={() => requestSort('new_value')}>{NEW_VALUE} {URLsort === "new_value" && <Icon />}</td>
        </tr>
      </thead>
      <tbody id="infinite-list">
        {items.slice(0, listSize).map((item) => 
          <tr onClick={() => bookMarkList(item.id)} key={item.id} className="table-body" style={{backgroundColor: bookMarkm.includes(item.id) && "yellow"}}>
            <td>{item.name}</td>
            <td>{new Date(item.date).toLocaleDateString("fa-IR")}</td>
            <td>{item.title}</td>
            <td>{item.field}</td>
            <td>{item.old_value}</td>
            <td>{item.new_value}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default Table