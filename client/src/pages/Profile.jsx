import React, { useEffect, useState } from 'react'
import DotGrid from '../components/test';
import { getMe, updateProfile } from '../services/authService';
import Navbar from '../components/navbar';

function Profile() {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [targetLow, setTargetLow] = useState(70);
    const [targetHigh, setTargetHigh] = useState(180);

    useEffect(()=>{
        const fetchUser = async ()=> {
            try{
                const data = await getMe();
                console.log(data)
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
    },[])

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            if (targetLow > targetHigh) {
                setError('Low target cannot be higher than high target');
                return;
            }

            const data = await updateProfile({
                diabetesType: user.diabetesType,
                targetBloodSugar: {
                    low: targetLow,
                    high: targetHigh
                }
            });

            setUser(data.user || user);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FAFAF9] dark:bg-[#121212] overflow-hidden">
            <div className="mt-17 absolute inset-0 z-0 overflow-hidden opacity-20">
                <DotGrid
                        dotSize={5}
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
            <Navbar />

            <div className="w-full max-w-175 mx-auto relative z-10 px-6 py-12">
                <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl shadow-black/5 p-8">
                    {error && error !== 'Low target cannot be higher than high target' && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    {loading && (
                        <p className="text-sm text-[#6E6E73] dark:text-[#9B9BA1] text-center">
                            Loading profile...
                        </p>
                    )}

                    {user && !loading && (
                        <div className="animate-fadeIn">
                            {/* USER PROFILE PIC AND MAIL */}
                            <div className="w-16 h-16 rounded-full bg-[#2563EB] flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-semibold text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            
                            <h1 className="text-xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] text-center mb-1">
                                {user.name}
                            </h1>
                            <p className="text-sm text-[#6E6E73] dark:text-[#9B9BA1] text-center mb-6">
                                {user.email}
                            </p>
                            
                            {/* Specific details of user */}
                            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1]">Name</span>
                                    <span className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] capitalize">
                                        {user.name || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1]">Email</span>
                                    <span className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7]">
                                        {user.email || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1]">Diabetes Type</span>
                                    <select
                                        value={user.diabetesType || ''}
                                        onChange={(e) => setUser({ ...user, diabetesType: e.target.value })}
                                        className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    >
                                        <option value="">Select type</option>
                                        <option value="type 1">Type 1</option>
                                        <option value="type 2">Type 2</option>
                                        <option value="gestational">Gestational</option>
                                        <option value="prediabetes">Prediabetes</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1] whitespace-nowrap">
                                        Target Range
                                    </span>
                                    <div className="flex items-center justify-end gap-3 flex-1">
                                        <select
                                            value={targetLow}
                                            onChange={(e) => setTargetLow(Number(e.target.value))}
                                            className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        >
                                            {Array.from({ length: 20 }, (_, i) => (i + 7) * 10).map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>

                                        <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1]">-</span>

                                        <select
                                            value={targetHigh}
                                            onChange={(e) => setTargetHigh(Number(e.target.value))}
                                            className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        >
                                            {Array.from({ length: 20 }, (_, i) => (i + 9) * 10).map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>

                                        <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1] whitespace-nowrap">
                                            mg/dL
                                        </span>
                                        </div>
                                </div>
                                {error === 'Low target cannot be higher than high target' && (
                                    <p className="text-sm text-red-500 text-right mt-1">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {success && (
                                <p className="text-sm text-green-500 text-center mt-6">{success}</p>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full mt-8 py-3 rounded-xl bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Profile
