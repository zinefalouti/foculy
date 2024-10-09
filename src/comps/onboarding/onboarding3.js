import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import CloseTag from '../../img/closebutton.png';

function Onboarding3() {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState(""); // State for priority
  const navigate = useNavigate();

  // Handle tag input and add when space is detected
  const handleTagInput = (e) => {
    const input = e.target.value;

    if (input.includes(" ")) {
      const newTags = input.split(" ").filter(tag => tag.trim() !== "");
      if (tags.length + newTags.length <= 10) {
        // Validate individual tag length
        if (newTags.some(tag => tag.length > 20)) {
          alert("Each tag should be less than 20 characters.");
          return;
        }
        setTags([...tags, ...newTags]);
      } else {
        alert("You can only add up to 10 tags.");
      }
      setTagInput("");
    } else {
      setTagInput(input);
    }
  };

  // Remove a specific tag from the list
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate due date to be in the future
    const selectedDate = new Date(dueDate);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      alert("Please select a future date and time.");
      return;
    }

    try {
      // Ensure the user is authenticated
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User is not authenticated");

      // Create a new task object with the 'completed' field set to false
      const newTask = {
        userId: userId,
        taskTitle: taskTitle,
        dueDate: selectedDate,
        tags: tags,
        taskDescription: taskDescription,
        priority: priority,
        completed: false, // Add the completed field, defaulting to false
        createdAt: new Date(), // Record when the task was created
      };

      console.log("Adding new task:", newTask); // Log for debugging

      // Add a new task document under the "tasks" collection
      await addDoc(collection(db, "tasks"), newTask);

      // Clear the form inputs after successful submission
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setTags([]);
      setTagInput("");
      setPriority("");

      // Redirect to dashboard or next step
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Check if the user is authenticated
  if (!auth.currentUser) {
    return <p>Please log in to continue.</p>;
  }

  return (
    <>
      <div className="onboardinghead">
        <h4>LET’S START WITH AN EXAMPLE</h4>
        <h1>
          Make Your First <span>Foculy</span>
        </h1>
        <h2>3/3</h2>
      </div>
      <div className="onboardbody">
        <form onSubmit={handleSubmit}>
          <div className="InputZone">
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Write a Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="InputZoneCustom">
            <label>Task Description</label>
            <textarea
              id="comments"
              name="comments"
              rows="2"
              cols="50"
              placeholder="Please describe your task"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
          </div>

          <div className="InputZone">
            <label>Due Date and Time</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="InputZone">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="" disabled>Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="InputZone">
            <label>Tags (separate with spaces)</label>
            <input
              type="text"
              placeholder="Write a tag and separate with spaces to confirm"
              value={tagInput}
              onChange={handleTagInput}
            />
          </div>

          <div className="TagsZone">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}{" "}
                <button type="button" onClick={() => removeTag(tag)}>
                  <img src={CloseTag} alt="Remove tag" />
                </button>
              </span>
            ))}
          </div>

          <div className="VSpacer">
            <input type="submit" className="TheButton" value="Next" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Onboarding3;
