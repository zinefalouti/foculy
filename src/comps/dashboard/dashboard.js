import React from 'react';
import Sidebar from './sidebar';
import Header from './header';
import Home from './home';
import { Route, Routes } from 'react-router-dom';
import Tasks from '../tasks/tasks';
import TaskDetail from '../tasks/taskDetails';
import EditTask from '../tasks/editTask';
import AddTask from '../tasks/addTask';
import Completed from '../tasks/completed';
import Profile from '../profile/profile';
import Stats from '../stats/stats';

function Dashboard({ isDark = false , ToggleTheme}) {

  return (
    <div className="grid grid-cols-12 pt-6 container mx-auto gap-4">
      <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <Sidebar/>
      </div>
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <Header isDark={isDark}/>
          
          <Routes>
            <Route path="/" element={<Home isDark={isDark} ToggleFunction={ToggleTheme}/>} />
            <Route path="tasks" element={<Tasks isDark={isDark} ToggleFunction={ToggleTheme}/>} />
            <Route path="tasks/:id" element={<TaskDetail isDark={isDark} Toggle={ToggleTheme} />} />
            <Route path="tasks/edittasks/:id" element={<EditTask isDark={isDark}/>} />
            <Route path="tasks/addtask" element={<AddTask isDark={isDark} />} />
            <Route path="completed" element={<Completed isDark={isDark} ToggleFunction={ToggleTheme} />} />
            <Route path="profile" element={<Profile isDark={isDark} ToggleFunction={ToggleTheme}/>} />
            <Route path="stats" element={<Stats isDark={isDark} ToggleFunction={ToggleTheme}/>} />
          </Routes>

      </div>
  
    </div>
  );
}

export default Dashboard;
