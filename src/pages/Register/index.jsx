import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        gender: 'MALE',
        dob: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const dobISO = formData.dob ? new Date(formData.dob).toISOString() : null;

            const payload = {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                gender: formData.gender,
                dob: dobISO,
                role: 'GUEST'
            };

            const response = await authService.register(payload);

            if (response.success) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                toast.error(response.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Đăng ký thất bại';
            toast.error(message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4 font-['Inter',system-ui,Avenir,Helvetica,Arial,sans-serif]">
            <div className="flex flex-col items-center w-full max-w-[500px] gap-6">
                <Link
                    to="/"
                    className="text-3xl font-bold text-[#1877f2] no-underline hover:drop-shadow-[0_0_2em_#646cffaa] transition-all cursor-pointer"
                >
                    ZSocial
                </Link>
                <div className="bg-white p-10 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] w-full text-left">
                    <h2 className="text-center mb-8 text-[#1877f2] mt-0 text-2xl font-bold">Đăng ký tài khoản</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Tên đăng nhập</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="font-medium text-[0.9rem] text-[#333]">Giới tính</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 cursor-pointer"
                                >
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="font-medium text-[0.9rem] text-[#333]">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 font-sans"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="font-medium text-[0.9rem] text-[#333]">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="p-3 border border-[#ddd] rounded-md text-base transition-colors bg-white text-[#333] w-full box-border focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full p-3 bg-[#1877f2] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-4 hover:bg-[#166fe5]">Đăng ký</button>
                    </form>
                    <p className="mt-6 text-center text-[0.9rem] text-[#666]">
                        Đã có tài khoản? <Link to="/login" className="text-[#1877f2] no-underline font-medium ml-1 hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
