import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import CloseTag from "../../img/closebutton.png";
import Cancel from "../../img/remove.png";
import Completed from "../../img/completed.png";

function EditTask() {
  const { id } = useParams(); 
  const [task, setTask] = useState({
    taskTitle: "",
    taskDescription: "",
    dueDate: "",
    priority: "",
    tags: [],
  }); 
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState(""); 
  
  useEffect(() => {
    const fetchTask = async () => {
      console.log("Fetching task with ID:", id);
      setLoading(true);
      try {
        const taskRef = doc(db, "tasks", id);
        const taskSnapshot = await getDoc(taskRef);
        console.log("Task snapshot:", taskSnapshot); // Log snapshot
  
        if (taskSnapshot.exists()) {
          const fetchedTask = taskSnapshot.data();
          console.log("Fetched task:", fetchedTask);
  
          setTask({
            id: taskSnapshot.id,
            taskTitle: fetchedTask.taskTitle || "",
            taskDescription: fetchedTask.taskDescription || "",
            dueDate: fetchedTask.dueDate
              ? new Date(fetchedTask.dueDate.seconds * 1000).toISOString().slice(0, 16)
              : "",
            priority: fetchedTask.priority || "",
            tags: fetchedTask.tags || [],
          });
        } else {
          console.log("No such task exists in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching task: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTask(); // Trigger task fetch
  }, [id]);
  
  // Save task to the database
  const handleSaveTask = async (e) => {
    e.preventDefault();

    // Parse dueDate into Firestore-compatible format
    const parsedDueDate = task.dueDate
      ? { seconds: new Date(task.dueDate).getTime() / 1000 }
      : null;

    // Prepare task data for saving
    const taskToSave = {
      taskTitle: task.taskTitle || "",
      taskDescription: task.taskDescription || "",
      dueDate: parsedDueDate, // Use Firestore format
      priority: task.priority || "",
      tags: task.tags,
    };

    console.log("Saving task:", taskToSave); // Debugging

    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, taskToSave);
      window.location.href = "/dashboard/tasks";
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Add a tag when spacebar or enter is pressed
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (newTag.trim() !== "") {
        setTask((prevTask) => ({
          ...prevTask,
          tags: [...prevTask.tags, newTag.trim()],
        }));
        setNewTag(""); // Clear the input field
      }
    }
  };

  // Remove a tag
  const handleRemoveTag = (indexToRemove) => {
    setTask((prevTask) => ({
      ...prevTask,
      tags: prevTask.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle change for controlled inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  if (loading) {
    return <p>Loading task details...</p>;
  }

  return (
    <form onSubmit={handleSaveTask}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <div className="Detail">
            <div className="InputZone">
              <label>Task Title</label>
              <input
                type="text"
                name="taskTitle"
                placeholder="Type Task Title"
                value={task.taskTitle}
                onChange={handleInputChange} // Handles dynamic input changes
              />
            </div>
            <div className="InputZoneCustom">
              <label>Task Description</label>
              <textarea
                rows="2"
                name="taskDescription"
                placeholder="Please describe your task"
                value={task.taskDescription}
                onChange={handleInputChange} // Handles dynamic input changes
                required
              />
            </div>
            <div className="InputZone">
              <label>Due Date and Time</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={task.dueDate}
                onChange={handleInputChange} // Handles dynamic input changes
                required
              />
            </div>
            <div className="InputZone">
              <label>Priority</label>
              <select
                name="priority"
                value={task.priority}
                onChange={handleInputChange} // Handles dynamic input changes
                required
              >
                <option value="" disabled>
                  Select Priority
                </option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Tags Section */}
            <div className="InputZone">
              <label>Tags</label>
              <input
                type="text"
                value={newTag}
                placeholder="Press space or enter to add tag"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag} // Add tag on spacebar or enter
              />
            </div>
            <div className="TagsZone">
              {task.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                  >
                    <img src={CloseTag} alt="Remove tag" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="Detail">
            <Link to={`/dashboard/tasks/${id}`} className="DetailButton">
              <img src={Cancel} alt="Cancel" /> Cancel
            </Link>
            <button type="submit" className="DetailActiveButton">
              <img src={Completed} alt="Save" /> Save Task
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EditTask;


