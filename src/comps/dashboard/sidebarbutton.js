import React from 'react'
import { Link } from 'react-router-dom';

function Sidebarbutton({isActive,Icon,GrayIcon,URI,Text}) {
  return (
    <>
       <Link to={URI} className={`SidebarButton ${isActive ? 'Active' : ''}`}><img src={isActive? Icon:GrayIcon}/> {Text}</Link>
    </>
  )
}

export default Sidebarbutton