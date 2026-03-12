import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authService.login(username, password);

            if (response.success) {
                const { token, userId, role, avatar, fullName } = response.data;
                // Lưu vào AuthContext (sẽ đồng bộ localStorage bên trong)
                login({ token, userId, role, avatar, fullName });

                toast.success('Đăng nhập thành công!');
                navigate('/feed');
            } else {
                toast.error(response.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
            toast.error(message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4 font-['Inter',system-ui,Avenir,Helvetica,Arial,sans-serif]">
            <div className="flex flex-col items-center w-full max-w-[400px] gap-6">
                <Link
                    to="/"
                    className="text-3xl font-bold text-[#1877f2] no-underline hover:drop-shadow-[0_0_2em_#646cffaa] transition-all cursor-pointer"
                >
                    ZSocial
                </Link>
                <div className="bg-white p-10 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] w-full text-left">
                    <h2 className="text-center mb-8 text-[#1877f2] mt-0 text-2xl font-bold">Đăng nhập</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập tên đăng nhập"
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full p-3 bg-[#1877f2] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-4 hover:bg-[#166fe5]">Đăng nhập</button>
                    </form>
                    <p className="mt-6 text-center text-[0.9rem] text-[#666]">
                        Chưa có tài khoản? <Link to="/register" className="text-[#1877f2] no-underline font-medium ml-1 hover:underline">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
