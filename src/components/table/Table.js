import { AD_NAME, DATE, FIELD, MODIFIER_NAME, NEW_VALUE, OLD_VALUE } from '../../constant/strings';
import './Table.css';
import Data from "../../constant/data.json"
import { useEffect, useState } from 'react';

function Table() {

  const [list, setList] = useState(Data.slice(0,20))
  
  
  useEffect(() => {
    window.addEventListener('scroll',()=>{
      if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        const newList = list
        newList.push(...Data.slice(list.length, list.length + 20))
        console.log(newList)
        setList(newList)
      }
    })

    return(
      window.removeEventListener("scroll", () => {})
    )

  },[list])

  return (
    <table>
      <thead>
        <tr className="table-head">
          <td>&#8607;{MODIFIER_NAME}</td>
          <td>&#8609;{DATE}</td>
          <td>&nbsp;{AD_NAME}</td>
          <td>{FIELD}</td>
          <td>{OLD_VALUE}</td>
          <td>{NEW_VALUE}</td>
        </tr>
      </thead>
      <tbody id="infinite-list">
        {list.map((item) => 
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