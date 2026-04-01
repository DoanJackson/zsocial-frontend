import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '@/services/authService';
import RegisterHeader from '@/components/Register/RegisterHeader';
import RegisterForm from '@/components/Register/RegisterForm';
import RegisterFooter from '@/components/Register/RegisterFooter';

// ─── Stitch Design Tokens (from tailwind.config in Stitch HTML) ───
// primary:                  #004be2
// primary-container:        #809bff
// on-primary:               #f2f1ff
// on-surface:               #2a2b51
// on-surface-variant:       #575881
// surface-container-lowest: #ffffff
// surface-container-low:    #f2efff
// background:               #f8f5ff
// outline:                  #72739e
// secondary:                #006571
// tertiary:                 #b60051
// .editorial-gradient: linear-gradient(135deg, #004be2 0%, #809bff 100%)
// .tonal-shadow: box-shadow: 0 32px 64px -12px rgba(42, 43, 81, 0.06)

function Register() {
    // ─── Business Logic (preserved 1:1 from original) ───────────────
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
        /* <body> — bg-background = #f8f5ff, font-body = Be Vietnam Pro */
        <div
            className="bg-[#f8f5ff] min-h-screen flex flex-col"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", color: '#2a2b51' }}
        >

            {/* ── Fixed header ── */}
            <RegisterHeader />

            {/* ── Main form (takes up remaining space between header & footer) ── */}
            <RegisterForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            {/* ── Footer ── */}
            <RegisterFooter />
        </div>
    );
}

export default Register;
