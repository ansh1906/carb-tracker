import { useState, useEffect } from 'react';
import { createMeal } from '../services/mealService';
import { getMe, updateProfile } from '../services/authService';
import AnalyzingLoader from '../components/AnalyzingLoader';
import DotGrid from '../components/test';
import SpectacularButton from '../components/SpectacularButton';
import { createReading, getTimeInRange } from '../services/glucoseService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SplitText from '../components/SplitText';
import TipCard from '../components/TipCard';
import Navbar from '../components/navbar';
import Sidebar from '../components/Sidebar';

function Dashboard() {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user,setUser] = useState(null);
    const [targetLow, setTargetLow] = useState(70);
    const [targetHigh, setTargetHigh] = useState(150);
    

    const [reading, setReading] = useState('');
    const [context, setContext] = useState('Random');
    const [readingError, setReadingError] = useState('');
    const [note, setNote] = useState('');
    const [tirData, setTirData] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const data = await createMeal(description);
            console.log('Meal logged successfully:', data);
            setResult(data.meal);
        } catch (err) {
            setError(err.message || 'Failed to analyze meal.');
        } finally {
            setLoading(false);
        } 
    };

    const fetchTimeInRange = async () => {
        try {
            const end = new Date().toISOString();
            const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const data = await getTimeInRange(start, end);
            setTirData(data);
        } catch (err) {
            console.error('Failed to load time-in-range', err);
        }
    };
    

    useEffect(() => {
        fetchTimeInRange();
        const fetchUser = async ()=> {
            try{
                const data = await getMe();
                setUser(data.user);
                setTargetLow(data.user.targetBloodSugar?.low || 70);
                setTargetHigh(data.user.targetBloodSugar?.high || 180);
            }catch{
                setError('Failed to load profile')
            }finally{
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleLogReading = async (e) => {
        e.preventDefault();
        setReadingError('');
        try {
            await createReading({
                reading: Number(reading),
                context,
                note: context === 'Other' ? note : ''
            });
            setReading('');
            setNote('');
            fetchTimeInRange(); // refresh chart with the new reading included
        } catch (err) {
            setReadingError(err.message || 'Failed to log reading.');
        }
    };

    const chartData = tirData
        ? [
              { name: 'Below Range', value: tirData.belowRangePercent },
              { name: 'In Range', value: tirData.inRangePercent },
              { name: 'Above Range', value: tirData.aboveRangePercent },
          ]
        : [];
    const hasChartData = chartData.some((entry) => Number(entry.value) > 0);

    const COLORS = ['#F59E0B', '#0D9488', '#DC2626'];

    const handleAnimationComplete = () => {
      console.log('All letters have animated!');
    };

    const scrollToNutritionTip = () => {
        const tipSection = document.getElementById('nutrition-tip');
        tipSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return ( 
        <div className="relative min-h-screen bg-[#FAFAF9] dark:bg-[#121212] pt-18">
            <Navbar onSidebarToggle={() => setMobileSidebarOpen(true)} />
            <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                setMobileOpen={setMobileSidebarOpen}
            />
            <div className="relative min-h-screen pb-12">
            <div className="fixed inset-0 z-0 overflow-hidden opacity-10 dark:opacity-30 pointer-events-none">
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
            <div className={`relative z-10 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-28' : 'md:pl-96'}`}>
            <div className="w-[90vw] max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
                {user && (
                    <SplitText
                        text={`Hello       ${user.name}!`}
                        className="w-full mb-3 text-4xl md:text-6xl dark:text-white text-gray-900 font-semibold text-center block"
                        delay={20}
                        duration={1.1}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                        onLetterAnimationComplete={handleAnimationComplete}
                        showCallback
                    />
                )}

                <section className="mb-8 md:mb-10 rounded-3xl border border-emerald-200/70 dark:border-emerald-900/60 bg-linear-to-br from-emerald-100 via-lime-50 to-white dark:from-[#173129] dark:via-[#13241e] dark:to-[#1C1C1E] shadow-xl shadow-emerald-900/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                        <div>
                            <p className="text-sm md:text-base uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 font-semibold mb-2">
                                Daily Focus
                            </p>
                            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1c2c23] dark:text-[#ddf5e6] leading-tight">
                                Track meals faster and scroll down for your highlighted nutrition tip.
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <SpectacularButton
                                type="button"
                                onClick={scrollToNutritionTip}
                                className="bg-[#0f766e] text-black dark:text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#0b5e58]"
                            >
                                Jump to Nutrition Tip
                            </SpectacularButton>
                        </div>
                    </div>
                </section>

                <section id="log-meal" className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-sm transition-colors duration-300 rounded-2xl shadow-xl shadow-black/5 p-6 md:p-8">
                    <h1 className="text-3xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-8">
                        Log a Meal
                    </h1>

                    <form onSubmit={handleSubmit} className="flex items-center flex-col gap-5">
                        <input
                            type="text"
                            placeholder="e.g. 2 rotis and dal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-5 py-4 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                        />
                        <SpectacularButton
                            type="submit"
                            disabled={loading}
                            className="w-3xl bg-[#739fff] dark:text-white text-gray-800 text-lg font-medium py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Log Meal
                        </SpectacularButton>
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
                </section>
                {/* --- Glucose reading + chart, side by side --- */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

                    {/* Reading form */}
                    <div className="bg-white mb-8 dark:bg-[#1C1C1E] rounded-2xl shadow-xl shadow-black/5 p-9">
                        <h2 className="text-3xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-8">
                            Log a Glucose Reading
                        </h2>
                        <form onSubmit={handleLogReading} className="flex items-center flex-col gap-5">
                            <input
                                type="number"
                                placeholder="e.g. 120"
                                value={reading}
                                onChange={(e) => setReading(e.target.value)}
                                required
                                className="w-full px-5 py-4 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                            />
                            <select
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full px-5 py-4 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                            >
                                <option value="Fasting">Fasting</option>
                                <option value="Before Meal">Before Meal</option>
                                <option value="After Meal">After Meal</option>
                                <option value="Random">Random</option>
                                <option value="Other">Other</option>
                            </select>
                            {context === 'Other' && (
                                <input
                                    type="text"
                                    placeholder="Add a note about this reading"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                                />
                            )}
                            <SpectacularButton
                                type="submit"
                                disabled={loading}
                                className="w-85 items-center bg-[#739fff] dark:text-white text-gray-800 text-lg font-medium py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Log Meal
                            </SpectacularButton>
                        </form>
                        {readingError && (
                            <p className="text-sm text-red-500 mt-4 text-center">{readingError}</p>
                        )}
                    </div>

                    <div className="rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-emerald-50 p-5 shadow-lg shadow-blue-900/5 dark:border-blue-950/70 dark:from-[#172338] dark:via-[#1C1C1E] dark:to-[#172b25] md:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Your weekly snapshot</p>
                                <h2 className="mt-1 text-3xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">Time in Range</h2>
                                <p className="mt-1 text-base text-[#6E6E73] dark:text-[#9B9BA1]">Last 7 days</p>
                            </div>
                            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-[#6E6E73] dark:bg-white/10 dark:text-[#B8B8C0]">Glucose</span>
                        </div>
                        {hasChartData ? (
                            <ResponsiveContainer width="100%" height={390}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="47%"
                                        outerRadius={132}
                                        innerRadius={82}
                                        paddingAngle={3}
                                        cornerRadius={8}
                                        startAngle={90}
                                        endAngle={-270}
                                        label={({ value }) => (value > 0 ? `${Number(value).toFixed(0)}%` : '')}
                                        labelLine={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-[#1C1C1E] text-3xl font-bold dark:fill-[#F5F5F7]">{Math.round(Number(tirData.inRangePercent))}%</text>
                                    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="fill-[#6E6E73] text-sm dark:fill-[#B8B8C0]">in range</text>
                                    <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #dbeafe', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)' }} formatter={(value) => [`${Number(value).toFixed(0)}%`, 'Share']} />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '16px', paddingTop: '16px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="my-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white/60 px-6 text-center dark:border-blue-900/70 dark:bg-white/5">
                                <div className="relative mb-5 flex h-36 w-36 items-center justify-center rounded-full border-18 border-blue-100 dark:border-blue-950">
                                    <div className="absolute inset-3 rounded-full border border-dashed border-emerald-300 dark:border-emerald-800" />
                                    <span className="text-4xl text-blue-500 dark:text-blue-300">+</span>
                                </div>
                                <h3 className="text-xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">Your chart is ready</h3>
                                <p className="mt-2 max-w-xs text-base leading-6 text-[#6E6E73] dark:text-[#B8B8C0]">Log your first glucose reading to see how much time you spend below, in, and above range.</p>
                            </div>
                        )}
                    </div>
                </section>
            <section id="nutrition-tip" className="mt-16 md:mt-22 scroll-mt-20">
                <TipCard emphasize />
            </section>
            </div>
            </div>
            </div>
        </div>
    );
}

export default Dashboard;