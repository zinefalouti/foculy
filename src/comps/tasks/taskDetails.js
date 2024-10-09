import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import CheckIcon from '../../img/taskcircle.png';
import CheckIconNight from '../../img/taskcirclenight.png';
import Clock from '../../img/clock.png';
import Back from '../../img/back.png';
import Edit from '../../img/edit.png';
import Remove from '../../img/remove.png';
import Completed from '../../img/completed.png';
import ThemeToggle from "../dashboard/themeToggle";

function TaskDetail({ isDark, Toggle }) {
  const { id } = useParams(); // Get the task ID from the URL
  const [task, setTask] = useState(null); // State to hold task data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskRef = doc(db, 'tasks', id); // Reference to the specific task document
        const taskSnapshot = await getDoc(taskRef);

        if (taskSnapshot.exists()) {
          setTask({ id: taskSnapshot.id, ...taskSnapshot.data() }); // Set task data
        } else {
          console.error('No such task!');
        }
      } catch (error) {
        console.error('Error fetching task: ', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTask(); // Fetch the task when the component mounts
  }, [id]);

  if (loading) {
    return <p>Loading task details...</p>; // Loading message
  }

  if (!task) {
    return <p>No task found.</p>; // Fallback if no task is found
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#FF6565'; // Color for high priority
      case 'medium':
        return '#F99954'; // Color for medium priority
      case 'low':
        return '#46D1BA'; // Color for low priority
      default:
        return ''; // No background if priority is unknown
    }
  };

  // Handle task deletion
  const handleRemoveTask = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      // Redirect back to the task list after deletion without alert
      window.location.href = '/dashboard/tasks';
    } catch (error) {
      console.error('Error removing task: ', error);
    }
  };

  // Handle marking task as complete
  const handleCompleteTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { completed: true });
      // Optionally update UI to reflect completion
      setTask((prevTask) => ({ ...prevTask, completed: true }));
    } catch (error) {
      console.error('Error completing task: ', error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <div className="Detail">
          <div className="DetailHead">
            <img src={isDark ? CheckIconNight : CheckIcon} />
            <div
              className="Priority"
              style={{ backgroundColor: getPriorityColor(task.priority) }} // Apply background color
            >
              {task.priority} Priority
            </div>
          </div>
          <h2>{task.taskTitle}</h2>
          <div className="DetailMiddle">
            <img src={Clock} />{' '}
            <h4>{new Date(task.dueDate.seconds * 1000).toLocaleString()}</h4>
            {/* Progress Bar Area */}
          </div>
          <div className="DetailText">{task.taskDescription}</div>
          <div className="FeedTags mt-6">
            Tags: {task.tags.join(', ')}
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <Link to="/dashboard/tasks" className="SidebarButton Active">
          <img src={Back} /> Back
        </Link>

        <div className="Detail">
          <h2>Task Control</h2>
          {/* Conditional rendering for Edit Task button */}
          {!task.completed && (
            <Link to={`/dashboard/tasks/edittasks/${id}`} className="DetailButton">
              <img src={Edit} /> Edit Task
            </Link>
          )}
          <Link to="#" onClick={handleRemoveTask} className="DetailButton">
            <img src={Remove} /> Remove Task
          </Link>

          {!task.completed && (
            <button onClick={handleCompleteTask} className="DetailActiveButton">
              <img src={Completed} /> Set to Complete
            </button>
          )}
        </div>

        <ThemeToggle isDark={isDark} ToggleFunction={Toggle} />
      </div>
    </div>
  );
}

export default TaskDetail;
