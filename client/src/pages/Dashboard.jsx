import { useState } from 'react';
import { createMeal } from '../services/mealService';
import Navbar from '../components/Navbar';
import AnalyzingLoader from '../components/AnalyzingLoader';
import DotGrid from '../components/test';
function Dashboard() {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        <div className="relative bg-[#FAFAF9] dark:bg-[#121212] min-h-screen overflow-hidden">
            <Navbar />
            <div className="mt-17 absolute inset-0 z-0 overflow-hidden opacity-20 dark:opacity-40 pointer-events-none">
                <DotGrid
                    dotSize={4}
                    gap={15}
                    baseColor="#2F293A"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>
            <div className="relative z-10 w-[80vw] max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 p-8">
                    <h1 className="text-2xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6">
                        Log a Meal
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="e.g. 2 rotis and dal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563EB] text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Log Meal
                        </button>
                    </form>

                    {loading && <AnalyzingLoader />}

                    {error && (
                        <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
                    )}

                    {result && !loading && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
                            <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-4">
                                Item(s) - {result.description}
                            </h2>

                            <ul className="space-y-2 text-2xl font-medium text-[#1C1C1E] dark:text-[#F5F5F7] mb-4">
                                <li>Carbs: {result.nutrients.totalCarbsGrams}g</li>
                                <li>Protein: {result.nutrients.proteinGrams}g</li>
                                <li>Fat: {result.nutrients.fatGrams}g</li>
                                <li>Calories: {result.nutrients.caloriesKcal} kcal</li>
                                <li>Fiber: {result.nutrients.fiberGrams}g</li>
                                <li>Sugar: {result.nutrients.sugarGrams}g</li>
                            </ul>

                            <p className="text-[23px] font-medium text-[#6363ff] dark:text-[#cccccc] mb-2">
                                <strong className="text-[#1C1C1E] dark:text-[#c3afff]">Glycemic load: </strong>
                                {result.glycemicLoad}
                            </p>
                            <p className="text-s text-[#6E6E73] dark:text-[#9B9BA1] italic">
                                {result.assumptions}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;