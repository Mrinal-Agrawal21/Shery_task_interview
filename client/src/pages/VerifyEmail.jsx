import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token') || '';
    const [token, setToken] = useState(tokenFromUrl);
    const navigate = useNavigate();

    const verifyMutation = useMutation({
        mutationFn: (tokenData) => axiosInstance.post('/verify-email', tokenData),
        onSuccess: (data) => {
            alert(data.data.message);
            navigate('/login');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Verification failed');
        }
    });

    useEffect(() => {
        // Auto-verify if token is in URL
        if (tokenFromUrl && !verifyMutation.isPending && !verifyMutation.isSuccess && !verifyMutation.isError) {
            verifyMutation.mutate({ token: tokenFromUrl });
        }
    }, [tokenFromUrl, verifyMutation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyMutation.mutate({ token });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Email</h2>

                {verifyMutation.isPending && <p className="text-center text-blue-600 mb-4">Verifying your email, please wait...</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Verification Token</label>
                        <input
                            type="text"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button type="submit" disabled={verifyMutation.isPending} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
                        {verifyMutation.isPending ? 'Verifying...' : 'Verify Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default VerifyEmail;
