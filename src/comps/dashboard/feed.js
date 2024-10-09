import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeedUnit from "./feedUnit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Assuming you have these exported from a firebase.js file
import Blank from './blank';

function Feed({ isDark, searchTerm }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out completed tasks
        const incompleteTasks = fetchedTasks.filter(task => !task.completed);
        
        setTasks(incompleteTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Helper function to format the due date
  const formatDueDate = (dueDate) => {
    const dateObj = new Date(dueDate.seconds ? dueDate.seconds * 1000 : dueDate); // Convert Firestore timestamp or string to Date object
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }; // Formatting options
    return dateObj.toLocaleString("en-US", options); // Format to 'Month day - HH:MM' (e.g., 'Oct 13 - 10:30 AM')
  };

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter(task => {
    // Check if task.tags is an array and is defined
    if (task.tags && Array.isArray(task.tags)) {
      // Check if any tag includes the search term directly (case-sensitive)
      return task.tags.some(tag => tag && tag.includes(searchTerm));
    }
    return false; // If tags are not valid, return false
  });

  return (
    <div className="Feed">
      <div className="FeedHead">
        <h2>Upcoming Tasks</h2>
        <Link className="SidebarButton Active" to="/dashboard/tasks">
          See More
        </Link>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length > 0 ? (
        filteredTasks.slice(0, 3).map((task) => ( // Limit to the first 3 tasks
          <FeedUnit
            key={task.id}
            isDark={isDark}
            Date={`due: ${formatDueDate(task.dueDate)}`} // Use the formatted due date
            Title={task.taskTitle}
            Priority={task.priority || 'No priority set'} // Handle missing priority
            Tags={Array.isArray(task.tags) ? task.tags : ["No tags available"]} // Check if tags is an array, fallback if not
            URI={`/dashboard/tasks/${task.id}`} // Correctly format the URI with the task ID
          />
        ))
      ) : (
        <Blank />
      )}
    </div>
  );
}

export default Feed;


