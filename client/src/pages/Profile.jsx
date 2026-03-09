import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-3xl font-bold mb-4">User Profile</h2>
                <div className="mb-6 space-y-2 text-left bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p><span className="font-semibold text-gray-700">Name:</span> {profileData?.name}</p>
                    <p><span className="font-semibold text-gray-700">Email:</span> {profileData?.email}</p>
                    <p><span className="font-semibold text-gray-700">User ID:</span> {profileData?.id}</p>
                </div>
                <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
