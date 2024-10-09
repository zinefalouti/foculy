import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Filter from "./filter";
import Taskblock from "./taskblock";
import ThemeToggle from "../dashboard/themeToggle";

function Tasks({ isDark, ToggleFunction }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(6);
  const [filters, setFilters] = useState({ date: "Latest", priority: "All" });

  // Fetch tasks from Firebase Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const tasksRef = collection(db, "tasks");
        // Query to fetch tasks where 'userId' matches and 'completed' is false
        const q = query(tasksRef, where("userId", "==", userId), where("completed", "==", false));
        const querySnapshot = await getDocs(q);

        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle filtering tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply date filter
    if (filters.date === "Latest") {
      filtered.sort((a, b) => new Date(b.dueDate.seconds * 1000) - new Date(a.dueDate.seconds * 1000));
    } else if (filters.date === "Oldest") {
      filtered.sort((a, b) => new Date(a.dueDate.seconds * 1000) - new Date(b.dueDate.seconds * 1000));
    }

    // Apply priority filter
    if (filters.priority !== "All") {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [filters, tasks]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(filteredTasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const showPrevButton = currentPage > 1;
  const showNextButton = currentPage < totalPages;

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <>
      {/* Filter Component */}
      <Filter
        isDark={isDark}
        FilterDate={(value) => handleFilterChange("date", value)}
        FilterPriority={(value) => handleFilterChange("priority", value)}
        totalTasks={filteredTasks.length}
        Next={() => paginate("next")}
        Prev={() => paginate("prev")}
        showPrevButton={showPrevButton}
        showNextButton={showNextButton}
      />

      {/* Display Task Blocks */}
      <div className="grid grid-cols-12 gap-4">
        {currentTasks.length > 0 ? (
          currentTasks.map(task => (
            <Taskblock
              key={task.id}
              isDark={isDark}
              Priority={task.priority || "No priority set"}
              Title={task.taskTitle}
              Date={`due: ${new Date(task.dueDate.seconds * 1000).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              Tags={Array.isArray(task.tags) ? task.tags : ["No tags available"]}
              URI={`${task.id}`}
            />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <ThemeToggle isDark={isDark} ToggleFunction={ToggleFunction} />
        </div>
      </div>
    </>
  );
}

export default Tasks;
