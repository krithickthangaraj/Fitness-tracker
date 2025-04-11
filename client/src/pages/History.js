import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { getMe } from '../utils/API';
import Auth from "../utils/auth";
import { formatDate } from '../utils/dateFormat';
import Header from "../components/Header";
import cardioIcon from "../assets/images/cardio.png";
import resistanceIcon from "../assets/images/resistance.png";
import 'chart.js/auto';
import './History.css'; // Ensure you have this for custom styles.

export default function History() {
  const [userData, setUserData] = useState({});
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(10);
  const [cardioChartData, setCardioChartData] = useState(null);
  const [exerciseTypeData, setExerciseTypeData] = useState(null);

  const loggedIn = Auth.loggedIn();
  let currentDate;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        const response = await getMe(token);
        if (!response.ok) throw new Error("Something went wrong!");

        const user = await response.json();
        
        if (user.cardio && user.resistance) {
          const cardio = user.cardio;
          const resistance = user.resistance;
          const exercise = cardio.concat(resistance);

          exercise.sort((a, b) => new Date(b.date) - new Date(a.date));
          exercise.forEach(item => item.date = formatDate(item.date));
          
          setUserData(user);
          setExerciseData(exercise);

          // Prepare cardio data for bar chart
          const cardioNames = cardio.map(item => item.name);
          const cardioDistances = cardio.map(item => item.distance);
          setCardioChartData({
            labels: cardioNames,
            datasets: [
              {
                label: 'Cardio Distance (miles)',
                data: cardioDistances,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          });

          // Prepare exercise type data for pie chart
          const cardioCount = cardio.length;
          const resistanceCount = resistance.length;
          setExerciseTypeData({
            labels: ['Cardio', 'Resistance'],
            datasets: [
              {
                data: [cardioCount, resistanceCount],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverOffset: 4,
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, [loggedIn]);

  function showMoreItems() {
    setDisplayedItems(displayedItems + 10);
  }

  if (!loggedIn) return <Navigate to="/login" />;

  return (
    <div className="history">
      <Header />
      <div className="container">
        <h2 className="title">Exercise History</h2>

        <div className="charts-container">
          {/* Cardio Bar Chart Section */}
          {cardioChartData && (
            <div className="chart-box">
              <h3 className="chart-title">Cardio Distance by Exercise</h3>
              <Bar
                data={cardioChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Exercise Names',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Distance (miles)',
                      },
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Exercise Type Pie Chart Section */}
          {exerciseTypeData && (
            <div className="chart-box">
              <h3 className="chart-title">Exercise Type Distribution</h3>
              <Pie
                data={exerciseTypeData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } },
                }}
              />
            </div>
          )}
        </div>

        {/* Exercise History List */}
        {exerciseData.length ? (
          <div className="history-data">
            {/* Create row layout for exercise cards */}
            <div className="exercise-row">
              {exerciseData.slice(0, displayedItems).map((exercise) => {
                let dateToDisplay;
                if (exercise.date !== currentDate) {
                  currentDate = exercise.date;
                  dateToDisplay = exercise.date;
                }

                // Determine the background color based on exercise type
                const exerciseClass = exercise.type === "cardio" ? "cardio-card" : "resistance-card";
                return (
                  <div className={`history-div ${exerciseClass}`} key={exercise._id}>
                    <div className="date">{dateToDisplay}</div>
                    <Link className="exercise-card" to={`/history/${exercise.type}/${exercise._id}`}>
                      <div className="card-content">
                        <div className="icon">
                          <img alt="exercise" src={exercise.type === "cardio" ? cardioIcon : resistanceIcon} className="history-icon" />
                        </div>
                        <div>
                          <p className="history-name">{exercise.name}</p>
                          {exercise.type === "cardio" ?
                            <p className="history-details">{exercise.distance} miles</p> :
                            <p className="history-details">{exercise.weight} lbs</p>
                          }
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            {exerciseData.length > displayedItems && (
              <div className="show-more-container">
                <button className="show-btn" onClick={showMoreItems}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-data">
            <h3>No exercise data yet...</h3>
            <Link to="/exercise">
              <button className="home-btn">Add Exercise</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
