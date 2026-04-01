import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import RegisterHeader from '@/components/Register/RegisterHeader';
import RegisterFooter from '@/components/Register/RegisterFooter';
import LoginForm from '@/components/Login/LoginForm';

/* ─── Stitch Design Tokens (from tailwind.config in Stitch HTML) ─── */
// primary:            #2962FF
// primary-container:  #809bff
// primary-dim:        #0041c7
// on-primary:         #f2f1ff
// on-surface:         #2a2b51
// on-surface-variant: #575881
// surface-container-lowest: #ffffff
// surface-container-low:    #f2efff
// surface-container-high:   #e1e0ff
// background:         #f8f5ff
// outline:            #72739e
// secondary-container:#26e6ff
// secondary:          #006571
// tertiary:           #b60051

function Login() {
    // ─── Business Logic (preserved 1:1 from original) ───────────────
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
        /* ─── <body> equivalent ─────────────────────────────────────────
           bg-background = #f8f5ff | font-body = Be Vietnam Pro          */
        <div
            className="bg-[#f8f5ff] min-h-screen flex flex-col"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", color: '#2a2b51' }}
        >
            {/* ── Google Fonts (same as Stitch <head>) ─── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .editorial-gradient {
                    background: linear-gradient(135deg, #2962FF 0%, #809bff 100%);
                }
                .tonal-shadow {
                    box-shadow: 0 32px 64px -12px rgba(42, 43, 81, 0.06);
                }
            `}</style>

            {/* ── <header> ── fixed top nav ──────────────────────────────── */}
            <RegisterHeader />

            {/* ── <main> ── centered form ────────────────────────────────── */}
            <LoginForm 
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                onSubmit={handleSubmit}
            />

            {/* ── <footer> ───────────────────────────────────────────────── */}
            <RegisterFooter />
        </div>
    );
}

export default Login;
