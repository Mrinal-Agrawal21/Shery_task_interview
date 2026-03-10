import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const Profile = () => {
    const navigate = useNavigate();

    const { data: profileData, isLoading, isError, error } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await axiosInstance.get('/profile');
            return response.data;
        },
        retry: false, // Don't retry on auth errors
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    if (isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <div className="text-red-600">Failed to load profile: {error.response?.data?.message || error.message}</div>
                <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Return to Login</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative">
            <Navbar user={profileData} />

            <main className="flex-grow flex justify-center items-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center mx-4">
                    <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
                    <p className="text-gray-600 mb-6 shrink-0">
                        You have successfully logged in to your account.
                    </p>
                    
                </div>
            </main>

            <footer className="w-full py-4 text-center">
                <p className="text-xs text-gray-400 opacity-70 tracking-widest font-mono">
                    ID: {profileData?.id}
                </p>
            </footer>
        </div>
    );
};

export default Profile;
