import { useState, useEffect } from 'react';
import { getNutritionTip } from '../services/newsService';
import SplitText from './SplitText';

function TipCard({ emphasize = false }) {
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

    const containerClass = emphasize
        ? 'bg-linear-to-br from-emerald-200 via-lime-100 to-yellow-100 dark:from-[#183329] dark:via-[#19372d] dark:to-[#27331b] rounded-3xl shadow-2xl shadow-emerald-900/20 p-7 md:p-12 border border-emerald-300/70 dark:border-emerald-800/70'
        : 'bg-green-300 dark:bg-[#162523] rounded-2xl shadow-xl shadow-black/5 p-8';

    const titleClass = emphasize
        ? 'w-full mb-6 text-5xl md:text-7xl dark:text-white text-[#122817] font-extrabold text-center block'
        : 'w-full mb-5 text-5xl md:text-6xl dark:text-white text-gray-900 font-semibold text-center block';

    const subtitleClass = emphasize
        ? 'mb-5 text-center text-sm md:text-base uppercase tracking-[0.16em] font-semibold text-emerald-800 dark:text-emerald-300'
        : 'hidden';

    const tipTitleClass = emphasize
        ? 'text-3xl md:text-5xl font-extrabold text-[#114d40] dark:text-[#d8f6ea] mb-4 leading-tight'
        : 'text-2xl font-bold text-[#355393] mb-2';

    const tipBodyClass = emphasize
        ? 'text-2xl md:text-3xl leading-relaxed text-[#1C1C1E] dark:text-[#F5F5F7] font-medium'
        : 'text-xl text-[#1C1C1E] dark:text-[#F5F5F7]';

    return (
        <div className={containerClass}>
            <p className={subtitleClass}>Featured Today</p>
            <SplitText
                text={`Nutrition Tip`}
                className={titleClass}
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
                    <h3 className={tipTitleClass}>{tip.title}</h3>
                    <p className={tipBodyClass}>{tip.tip}</p>
                </div>
            )}
        </div>
    );
}

export default TipCard;