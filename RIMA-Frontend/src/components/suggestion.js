import React from 'react'
import {  NavLink } from 'react-router-dom'


const Suggestions = (props) => {
  const options = props.results.map(r => (
    <NavLink to={`/app/profile/${r.id}`} key={r.id} onClick={props.myClick}>
      <li style={{ padding: '10px', width: '18em', background: 'white', listStyleType: 'none', borderBottom: '3px solid black' }} >
        {`${r.first_name} ${r.last_name}`}
      </li>
    </NavLink>
  ))
  return <div style={{ width: '294px', position: 'absolute', top: '4em', right: '13.2em', }}>
    <ul>{options}</ul>
  </div>
}

export default Suggestions