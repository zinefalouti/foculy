import React from 'react'
import logo from '../../img/logo.png';
import switchNight from '../../img/switchday.png';
import switchDay from '../../img/switchnight.png';
import { Link } from 'react-router-dom';

function LoginHeader({isDark=false,handleChange}) {

 

  return (
    
    <div className="logoArea">
      <Link to="/"><img src={logo} className="logo" alt="Foculy Logo"/></Link>
      <button onClick={handleChange}><img className="Switcher" src={isDark? switchNight:switchDay}/></button>
    </div> 
  )
}

export default LoginHeader