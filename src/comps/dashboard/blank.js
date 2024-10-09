import React from 'react'
import Blank from '../../img/blank.png';
import { Link } from 'react-router-dom';
import AddIcon from '../../img/add.png';

function blank() {
  return (
    <div className="BlankPage">

         <h4>Why not start with your first task?</h4>
         <h1>No Tasks At The Moment!</h1>
         <div className="BlankImage">
           <img src={Blank}/>
         </div>
         <Link className="SidebarButton Active" to="/dashboard/tasks/addtask"><img src={AddIcon} alt="Add Task" />New Task</Link>


    </div>
  )
}

export default blank