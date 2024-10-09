import React, { useState } from "react";
import TaskIcon from "../../img/taskfull.png";
import { Link } from "react-router-dom";

function CompletedBlock({ isDark, Priority, Date, Title, Tags, URIFunction}) {
  const [showAllTags, setShowAllTags] = useState(false); // State to control tag panel visibility

  // Ensure Tags is an array (safeguard in case Tags is not passed correctly)
  const tagArray = Array.isArray(Tags) ? Tags : []; // If Tags is not an array, use an empty array

  // Function to toggle the display of the remaining tags
  const toggleTagPanel = () => setShowAllTags(!showAllTags);

  // Limit the displayed tags to 2, and calculate the remaining tags
  const visibleTags = tagArray.slice(0, 2);
  const remainingTags = tagArray.length - 2; // Number of hidden tags

  // Function to determine the background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
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

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <div className="TaskBlock" onClick={URIFunction} style={{ cursor: 'pointer' }}>
          <div className="TaskHead FeedBottom">
            <img src={TaskIcon} alt="Task Icon" />
            <div 
              className="Priority" 
              style={{ backgroundColor: getPriorityColor(Priority) }} // Apply background color
            >
              {Priority} Priority
            </div>
          </div>
          <h4 className="mt-4">{Date}</h4>
          <h2>{Title}</h2>
          <div className="TaskBottom">
            <div className="FeedTags">
              {/* Fallback message if no tags are present */}
              {tagArray.length > 0 ? (
                <>
                  Tags: {visibleTags.join(", ")}
                  {remainingTags > 0 && (
                    <>
                      <button
                        onClick={(event) => {
                          event.preventDefault(); // Prevent the default action
                          event.stopPropagation(); // Prevent the Link from being triggered
                          toggleTagPanel(); // Toggle the tag panel
                        }}
                        className="TagToggle"
                      >
                        +{remainingTags} more
                      </button>
                      {showAllTags && (
                        <div className="AllTagsPanel">
                          {tagArray.join(", ")} {/* Displays all tags */}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p>No tags available</p> // Display when no tags are passed
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default CompletedBlock;
