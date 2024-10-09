import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import check from '../../img/check.png';
import checkNight from '../../img/checknight.png';
import cancel from '../../img/cancel.png';
import cancelNight from '../../img/cancelnight.png';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase"; // Adjust this path based on your Firebase setup

function HomeStats({ isDark }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        let completedTasks = 0;
        let canceledTasks = 0;
        let totalTasks = 0;
        const currentDate = new Date();

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const taskDueDate = new Date(task.dueDate.seconds * 1000); // Firestore timestamp to Date

          totalTasks += 1; // Increment total tasks count

          // Check if the task is completed
          if (task.completed === true) {
            completedTasks += 1;
          } 
          // Check if the task is canceled (not completed and due date is in the past)
          else if (taskDueDate < currentDate && task.completed === false) {
            canceledTasks += 1;
          }
        });

        setCompletedCount(completedTasks);
        setCanceledCount(canceledTasks);
        setTotalCount(totalTasks); // Set total tasks
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task stats: ", error);
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (loading) {
    return <p>Loading task statistics...</p>;
  }

  // Calculate percentage of completed tasks
  const CompletedPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Data for the donut chart
  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Canceled', value: canceledCount },
    { name: 'Remaining', value: totalCount - completedCount - canceledCount }
  ];

  // Colors for the chart segments
  const COLORS = ['#0088FE', '#FF8042', '#CCCCCC']; // Change colors as desired

  return (
    <div className="HomeStats">
      <h2>Performance</h2>

      <div className="HomeStatBlock">
        <img src={isDark ? checkNight : check} alt="Completed Icon" />
        <h2>Completed:</h2>
        <span>{completedCount}</span>
      </div>

      <div className="HomeStatBlock">
        <img src={isDark ? cancelNight : cancel} alt="Canceled Icon" />
        <h2>Canceled:</h2>
        <span>{canceledCount}</span>
      </div>

      <div className="DonutChart">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#4A90E2"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <h3>
          <span>{CompletedPercentage.toFixed(2)}%</span> of your tasks were completed
        </h3>
      </div>
    </div>
  );
}

export default HomeStats;
