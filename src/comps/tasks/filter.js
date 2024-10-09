import React from 'react';
import FilterIcon from '../../img/filter.png';
import PageNext from '../../img/pagenext.png';
import PagePrev from '../../img/pageprev.png';

function Filter({ isDark, FilterDate, FilterPriority, totalTasks, Next, Prev, showPrevButton, showNextButton }) {
  return (
    <div className="FilterDiv grid grid-cols-12 gap-2 align-middle">
      {/* Filter icon */}
      <div className="hidden lg:block lg:col-span-2 xl:col-span-1 mt-4">
        <img src={FilterIcon} alt="Filter Icon" />
      </div>

      {/* Date filter */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-3 -mt-2">
        <div className="InputZone">
          <label>By Date</label>
          <select onChange={(e) => FilterDate(e.target.value)}>
            <option value="Latest">By Latest</option>
            <option value="Oldest">By Oldest</option>
            <option value="Random">Random</option>
          </select>
        </div>
      </div>

      {/* Priority filter */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-3 -mt-2">
        <div className="InputZone">
          <label>By Priority</label>
          <select onChange={(e) => FilterPriority(e.target.value)}>
            <option value="All">All</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task count */}
      <div className="col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-3 mt-4 ml-4">
        <h4>Total Tasks: <span>{totalTasks}</span></h4>
      </div>

      {/* Pagination buttons */}
      <div className="col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-2 mt-4 flex justify-end gap-2">
        {showPrevButton && (
          <button onClick={Prev}>
            <img src={PagePrev} alt="Previous" />
          </button>
        )}
        {showNextButton && (
          <button onClick={Next}>
            <img src={PageNext} alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Filter;
