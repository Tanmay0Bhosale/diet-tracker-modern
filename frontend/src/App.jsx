import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const COLORS = ['#3EB489', '#FFB703', '#023047', '#8ECAE6', '#FF8C42'];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [page, setPage] = useState(token ? 'app' : 'auth');
  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [newMeal, setNewMeal] = useState({ name: '', calories: '' });

  useEffect(() => { if (token) fetchProfile(); }, [token]);
  useEffect(() => { if (token) fetchMeals(); }, [date, token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers: { Authorization: 'Bearer ' + token } });
      setProfile(res.data);
      setPage('app');
    } catch {
      localStorage.removeItem('token'); setToken(''); setPage('auth');
    }
  };

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${API}/meals`, { headers: { Authorization: 'Bearer ' + token }, params: { date } });
      setMeals(res.data.meals);
      setProfile(prev => ({ ...prev, bmi: res.data.bmi || prev?.bmi }));
    } catch (err) { console.error(err); }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;
    try {
      await axios.post(`${API}/meals`, { ...newMeal, calories: Number(newMeal.calories), date }, { headers: { Authorization: 'Bearer ' + token } });
      setNewMeal({ name: '', calories: '' });
      fetchMeals();
    } catch (err) { console.error(err); }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`${API}/meals/${id}`, { headers: { Authorization: 'Bearer ' + token } });
      fetchMeals();
    } catch (err) { console.error(err); }
  };

  const logout = () => { localStorage.removeItem('token'); setToken(''); setPage('auth'); setProfile(null); }

  // Daily Calorie Goal based on BMI
  const dailyCalories = () => {
    if (!profile?.bmi || !profile?.weightKg) return 2000;
    const bmi = profile.bmi;
    if (bmi < 18.5) return 2500;
    if (bmi < 24.9) return 2200;
    if (bmi < 29.9) return 2000;
    return 1800;
  };

  const caloriesGoal = dailyCalories();
  const caloriesEaten = meals.reduce((sum, m) => sum + m.calories, 0);
  const caloriesRemaining = Math.max(caloriesGoal - caloriesEaten, 0);

  const chartData = [
    { name: 'Eaten', value: caloriesEaten },
    { name: 'Remaining', value: caloriesRemaining }
  ];

  if (page === 'auth') return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl grid grid-cols-2 gap-6">
        {/* Login Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.target);
            try {
              const res = await axios.post(`${API}/auth/login`, { email: f.get('email'), password: f.get('password') });
              localStorage.setItem('token', res.data.token);
              setToken(res.data.token);
            } catch (err) { alert(err.response?.data?.message || 'Login failed'); }
          }} className="space-y-3">
            <input name="email" placeholder="Email" required className="input" />
            <input name="password" type="password" placeholder="Password" required className="input" />
            <button className="btn-primary w-full">Login</button>
          </form>
        </div>
        {/* Register Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.target);
            try {
              const res = await axios.post(`${API}/auth/register`, {
                name: f.get('name'), email: f.get('email'), password: f.get('password'),
                heightCm: Number(f.get('heightCm') || 0), weightKg: Number(f.get('weightKg') || 0)
              });
              localStorage.setItem('token', res.data.token);
              setToken(res.data.token);
            } catch (err) { alert(err.response?.data?.message || 'Register failed'); }
          }} className="space-y-3">
            <input name="name" placeholder="Name" className="input" />
            <input name="email" placeholder="Email" className="input" />
            <input name="password" type="password" placeholder="Password" className="input" />
            <div className="grid grid-cols-2 gap-2">
              <input name="heightCm" placeholder="Height (cm)" className="input" />
              <input name="weightKg" placeholder="Weight (kg)" className="input" />
            </div>
            <button className="btn-primary w-full">Register</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-primary">Diet Tracker</h1>
          <div className="flex flex-col items-end">
            <span className="text-gray-600">Hello, <strong>{profile?.name}</strong></span>
            <span className="text-gray-700">BMI: <strong>{profile?.bmi || '—'}</strong></span>
            <button onClick={logout} className="btn mt-2">Logout</button>
          </div>
        </header>

        {/* Meal Add Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add a Meal</h2>
            <form onSubmit={handleAddMeal} className="flex flex-col gap-4">
              <input placeholder="Meal Name" value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} className="input" />
              <input placeholder="Calories" type="number" value={newMeal.calories} onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })} className="input" />
              <button type="submit" className="btn-primary">Add Meal</button>
            </form>

            <ul className="mt-6 divide-y divide-gray-200">
              {meals.map((m) => (
                <li key={m._id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{m.name}</span> - <span className="text-gray-600">{m.calories} kcal</span>
                  </div>
                  <button onClick={() => handleDeleteMeal(m._id)} className="text-red-500 hover:underline">Delete</button>
                </li>
              ))}
              {meals.length === 0 && <li className="py-2 text-gray-400 text-center">No meals yet</li>}
            </ul>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Calories Progress</h2>
            {meals.length === 0 ? (
              <div className="text-gray-400">Add meals to see your daily progress</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Eaten' ? '#3EB489' : caloriesEaten > caloriesGoal ? '#FF4C4C' : '#E3FDFD'}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} kcal`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 text-gray-700 font-medium">
              Eaten: {caloriesEaten} kcal / Goal: {caloriesGoal} kcal
            </div>
            {caloriesEaten > caloriesGoal && (
              <div className="mt-2 text-red-500 font-semibold">⚠️ You have exceeded your daily calorie goal!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
