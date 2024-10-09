import React from 'react'
import ToggleNight from '../../img/switchnight.png';
import ToggleDay from '../../img/switchday.png';

function ThemeToggle({isDark,ToggleFunction}) {
  return (
    <div className="ToggleArea">
       <h2>{isDark? 'Switch to Day':'Switch to Night'}</h2>
       <button onClick={ToggleFunction}><img src={isDark? ToggleDay:ToggleNight} /></button>
    </div>
  )
}

export default ThemeToggle