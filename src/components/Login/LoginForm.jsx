import { Link } from 'react-router-dom';

function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
    return (
        <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Ambient blur orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
                style={{ background: 'rgba(128, 155, 255, 0.20)', filter: 'blur(100px)' }}
            />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
                style={{ background: 'rgba(38, 230, 255, 0.20)', filter: 'blur(100px)' }}
            />

            {/* Card ─ max-w-[480px] */}
            <div className="w-full max-w-[480px] z-10">
                <div
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-white/40 tonal-shadow"
                    style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                >
                    {/* ── Heading block ───────────────────────────────── */}
                    <div className="mb-10 text-center md:text-left">
                        <h1
                            className="text-4xl font-extrabold tracking-tight text-[#2a2b51] mb-3 leading-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Chào mừng trở lại.
                        </h1>
                        <p className="text-[#575881] font-medium">
                            Thế giới chuyển động của ZSocial đang chờ đợi bạn.
                        </p>
                    </div>

                    {/* ── Form ─────────────────────────────────────────── */}
                    <form className="space-y-6" onSubmit={onSubmit}>
                        {/* Username field */}
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-bold tracking-wide text-[#575881] ml-4"
                                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                htmlFor="username"
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                className="w-full px-6 py-4 bg-[#f2efff] border-none rounded-full
                                           focus:ring-2 focus:ring-[#2962FF]/20 focus:bg-white
                                           transition-all placeholder:text-[#72739e]
                                           outline-none text-[#2a2b51]"
                                id="username"
                                placeholder="Nhập tên đăng nhập của bạn"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-4">
                                <label
                                    className="block text-sm font-bold tracking-wide text-[#575881]"
                                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                    htmlFor="password"
                                >
                                    Mật khẩu
                                </label>
                                <a
                                    className="text-xs font-bold text-[#2962FF] hover:text-[#0041c7] transition-colors mr-2 cursor-pointer"
                                    href="#"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <input
                                className="w-full px-6 py-4 bg-[#f2efff] border-none rounded-full
                                           focus:ring-2 focus:ring-[#2962FF]/20 focus:bg-white
                                           transition-all placeholder:text-[#72739e]
                                           outline-none text-[#2a2b51]"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit button — editorial-gradient pill */}
                        <button
                            className="cursor-pointer w-full py-4 editorial-gradient text-[#f2f1ff] font-bold
                                       rounded-full text-lg active:scale-[0.98] transition-all"
                            style={{
                                fontFamily: "'Be Vietnam Pro', sans-serif",
                                boxShadow: '0 8px 30px -8px rgba(41, 98, 255, 0.35)',
                            }}
                            type="submit"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* ── Social divider ───────────────────────────────── */}
                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="w-full border-t border-[#e1e0ff]" />
                            <span
                                className="absolute bg-white px-4 text-xs font-bold text-[#72739e] uppercase tracking-widest"
                                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                            >
                                Hoặc kết nối với
                            </span>
                        </div>

                        {/* Social buttons grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Google */}
                            <button className="cursor-pointer flex items-center justify-center gap-3 py-3 px-4
                                               bg-white border border-gray-200 rounded-full
                                               hover:bg-gray-50 transition-colors font-bold text-sm text-[#2a2b51]">
                                {/* Google SVG logo (inline, no external image dependency) */}
                                <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                Google
                            </button>

                            {/* Facebook */}
                            <button className="cursor-pointer flex items-center justify-center gap-3 py-3 px-4
                                               bg-[#1877F2] rounded-full hover:opacity-90
                                               transition-opacity font-bold text-sm text-white">
                                {/* Facebook SVG logo (inline) */}
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.254h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    {/* ── Register link ─────────────────────────────────── */}
                    <div className="mt-10 text-center">
                        <p className="text-[#575881] font-medium text-sm">
                            Chưa có tài khoản?{' '}
                            <Link
                                to="/register"
                                className="text-[#2962FF] font-bold ml-1 hover:underline underline-offset-4"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default LoginForm;
