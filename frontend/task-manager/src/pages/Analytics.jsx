import React, { useState, useEffect } from 'react';
import './Analytics.css';
import { fetchAnalytics } from "../api/AnalyticsApi";

const AnalyticsPage = () => {
  const [taskStats, setTaskStats] = useState( {statusAnalytics: {
    backlog: 0,
    "to-do": 0,
    "in-progress": 0,
    completed: 0,
  },
  priorityAnalytics: {
    Low: 0,
    Moderate: 0,
    High: 0,
  }}
  );
  
  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setTaskStats({
          statusAnalytics: data.statusAnalytics || {},
          priorityAnalytics: data.priorityAnalytics || {},
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    getAnalytics();
  }, []);

  return (
    <div className="analyticsContainer">
    <p>Analytics</p>
    <div className="boxContainer">
      <div className="box1">
        <ul>
          <li>Backlog Tasks</li>
          <li>To-Do Tasks</li>
          <li>In-Progress Tasks</li>
          <li>Completed Tasks</li>
        </ul>
        <ul style={{ listStyle: "none" }}>
          <li>{taskStats?.statusAnalytics.backlog || 0}</li>
          <li>{taskStats?.statusAnalytics["to-do"]|| 0}</li>
          <li>{taskStats?.statusAnalytics["in-progress"]  || 0}</li>
          {/* <li>{taskStats?.completedTasks || 0}</li> */}
        </ul>
      </div>
      <div className="box2">
        <ul>
          <li>Low Priority</li>
          <li>Moderate Priority</li>
          <li>High Priority</li>
          <li>Due Date Tasks</li>
        </ul>
        <ul style={{ listStyle: "none" }}>
          <li>{taskStats?.priorityAnalytics.Low  || 0}</li>
          <li>{taskStats?.priorityAnalytics.Moderate|| 0}</li>
          <li>{taskStats?.priorityAnalytics.High|| 0}</li>
          {/* <li>{taskStats?.cardsWithDueDate || 0}</li> */}
        </ul>
      </div>
    </div>
  </div>
);
}

export default AnalyticsPage;