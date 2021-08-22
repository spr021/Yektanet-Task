import { AD_NAME, DATE, FIELD, MODIFIER_NAME, NEW_VALUE, OLD_VALUE } from '../../constant/strings';
import './Table.css';
import Data from "../../constant/data.json"
import { useEffect, useState } from 'react';
import useSortableData from '../../utils/useSortableData';

function Table() {
  const [listSize, setListSize] = useState(5)
  const { items, requestSort } = useSortableData(Data);
  
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
          <td onClick={() => requestSort('name')}>&#8607;{MODIFIER_NAME}</td>
          <td onClick={() => requestSort('date')}>&#8609;{DATE}</td>
          <td onClick={() => requestSort('title')}>&nbsp;{AD_NAME}</td>
          <td onClick={() => requestSort('field')}>{FIELD}</td>
          <td onClick={() => requestSort('old_value')}>{OLD_VALUE}</td>
          <td onClick={() => requestSort('new_value')}>{NEW_VALUE}</td>
        </tr>
      </thead>
      <tbody id="infinite-list">
        {items.slice(0, listSize).map((item) => 
          <tr key={item.id} className="table-body">
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
  );
}

export default Table;