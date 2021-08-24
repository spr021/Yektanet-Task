import { useState } from 'react'
import useSortableData from '../../utils/useSortableData'
import Data from "../../constant/data.json"
import './Table.css'
import {
  AD_NAME,
  DATE,
  FIELD,
  MODIFIER_NAME,
  NEW_VALUE,
  OLD_VALUE,
  PRESS_ENTER,
  PRICE,
  TITLE
} from '../../constant/strings'

function Table() {
  const [listSize, setListSize] = useState(20)
  const { items, requestSort, requestSearch, addToBookMark } = useSortableData(Data)
  const bookMarkm = JSON.parse(window.localStorage.getItem("book-mark")) || []
  
  const params = new URLSearchParams(window.location.search)
  const URLsort = params.get('sort')
  const URLd = params.get('d')

  const Icon = () => {
    if(URLd === "ascending") return(<span>&#8607;</span>)
    if(URLd === "descending") return(<span>&#8609;</span>)
  }
  
  window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      setListSize(listSize + 10)
    }
  }

  const clearInput = (e) => {
    e.target.value = null
    requestSearch()
  }

  const search = (e) => {
    if(e.key === 'Enter' || e.target.name === "date" || e.target.name === "field") {
      requestSearch(e.target.name, e.target.value)
    }
  }

  return (
    <>
      <div className="search">
        <div className="tooltip">
          <span className="tooltiptext">{PRESS_ENTER}</span>
          <label>{MODIFIER_NAME}</label>
          <input onBlur={clearInput} onKeyDown={search} className="input" name="name" />
        </div>
        <div>
          <label>{DATE}</label>
          <input onBlur={clearInput} onChange={search} className="input" type="date" name="date" />
        </div>
        <div className="tooltip">
          <span className="tooltiptext">{PRESS_ENTER}</span>
          <label>{AD_NAME}</label>
          <input onBlur={clearInput} onKeyDown={search} className="input" name="title" />
        </div>
        <div>
          <label>{FIELD}</label>
          <select onBlur={clearInput} onChange={search} className="input" name="field">
            <option value={TITLE}>{TITLE}</option>
            <option value={PRICE}>{PRICE}</option>
          </select>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr className="table-head">
            <td onClick={() => requestSort('name')}>
              {MODIFIER_NAME} {URLsort === "name" && <Icon />}
            </td>
            <td onClick={() => requestSort('date')}>
              {DATE} {URLsort === "date" && <Icon />}
            </td>
            <td onClick={() => requestSort('title')}>
              {AD_NAME} {URLsort === "title" && <Icon />}
            </td>
            <td onClick={() => requestSort('field')}>
              {FIELD} {URLsort === "field" && <Icon />}
            </td>
            <td onClick={() => requestSort('old_value')}>
              {OLD_VALUE} {URLsort === "old_value" && <Icon />}
            </td>
            <td onClick={() => requestSort('new_value')}>
              {NEW_VALUE} {URLsort === "new_value" && <Icon />}
            </td>
          </tr>
        </thead>
        <tbody id="infinite-list">
          {items.slice(0, listSize).map((item) => 
            <tr
              onClick={() => addToBookMark(item.id)}
              key={item.id}
              className={`${bookMarkm.includes(item.id) && "book-mark"} table-body`}
            >
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
    </>
  )
}

export default Table