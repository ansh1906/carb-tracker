import { useState, useEffect } from 'react';
import { getNutritionTip } from '../services/newsService';
import SplitText from './SplitText';

function TipCard() {
    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const data = await getNutritionTip();
                setTip(data);
            } catch (err) {
                setError('Could not load tip right now.');
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, []);

    return (
        <div className="bg-green-300 dark:bg-[#162523] rounded-2xl shadow-xl shadow-black/5 p-8">
            <SplitText
                text={`Nutrition Tip`}
                className="w-full mb-5 text-5xl md:text-6xl dark:text-white text-gray-900 font-semibold text-center block"
                delay={20}
                duration={1.1}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="0px"
                textAlign="center"
            />

            {loading && !error && (
                <p className="text-sm text-[#6E6E73] dark:text-[#9B9BA1]">Loading tip...</p>
            )}

            {error && !loading && <p className="text-sm text-red-500">{error}</p>}

            {tip && !loading && (
                <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold text-[#2563EB] mb-2">{tip.title}</h3>
                    <p className="text-sm text-[#1C1C1E] dark:text-[#F5F5F7]">{tip.tip}</p>
                </div>
            )}
        </div>
    );
}

export default TipCard;