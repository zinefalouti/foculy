import React, { useState, useEffect } from 'react';
import HomeStats from '../dashboard/homeStats';
import ThemeToggle from '../dashboard/themeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../firebase"; // Assumed firebase config

function Stats({ isDark, ToggleFunction }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // Helper function to group tasks by day
        const groupByDay = (tasks) => {
          const grouped = {};
          const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toLocaleDateString("en-US", { weekday: 'short' });
            grouped[key] = { canceled: 0, completed: 0, added: 0 };
            return key;
          }).reverse();

          tasks.forEach((task) => {
            const taskDate = new Date(task.createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
            const dayKey = taskDate.toLocaleDateString("en-US", { weekday: 'short' });
            if (last7Days.includes(dayKey)) {
              grouped[dayKey].added += 1;
              if (task.completed) {
                grouped[dayKey].completed += 1;
              } else if (task.canceled) {
                grouped[dayKey].canceled += 1;
              }
            }
          });

          // Convert the grouped object to an array compatible with Recharts
          return last7Days.map(day => ({
            day,
            ...grouped[day]
          }));
        };

        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedData = groupByDay(fetchedTasks);
        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <div className="Detail">
          <h2 className="mb-16">Task Activity For the Week</h2>

          {loading ? (
            <p>Loading chart data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="canceled" stroke="#FF6565" name="Canceled Tasks" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#4A90E2" name="Completed Tasks" strokeWidth={2} />
                <Line type="monotone" dataKey="added" stroke="#9CA8B6" name="Added Tasks" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="col-span-12  lg:col-span-4">
        <HomeStats isDark={isDark} />
        <ThemeToggle isDark={isDark} ToggleFunction={ToggleFunction} />
      </div>
    </div>
  );
}

export default Stats;

