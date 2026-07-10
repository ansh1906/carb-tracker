import React from 'react'
import { useState } from 'react';
import {createMeal} from '../services/mealService'

function Dashboard() {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
        const data = await createMeal(description);
        setResult(data.meal);
        } catch (err) {
        setError(err.message || 'Failed to analyze meal.');
        } finally {
        setLoading(false);
        }
    };


    return (
        <div>
            <h1>Log a Meal</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="e.g. 2 rotis and dal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
                <button type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Log Meal'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div>
                <h2>{result.description}</h2>
                <ul>
                    <li>Carbs: {result.nutrients.totalCarbsGrams}g</li>
                    <li>Protein: {result.nutrients.proteinGrams}g</li>
                    <li>Fat: {result.nutrients.fatGrams}g</li>
                    <li>Calories: {result.nutrients.caloriesKcal} kcal</li>
                    <li>Fiber: {result.nutrients.fiberGrams}g</li>
                    <li>Sugar: {result.nutrients.sugarGrams}g</li>
                </ul>
                <p><strong>Glycemic load:</strong> {result.glycemicLoad}</p>
                <p><em>{result.assumptions}</em></p>
                </div>
            )}
        </div>
    )
}

export default Dashboard
