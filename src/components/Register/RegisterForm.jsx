import { Link } from 'react-router-dom';

function RegisterForm({ formData, onChange, onSubmit }) {
    return (
        /* <main> — the outer centered container */
        <main className="flex-grow flex items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Abstract Kinetic Background Elements */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
                style={{ background: 'rgba(128, 155, 255, 0.20)', filter: 'blur(100px)' }}
            />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
                style={{ background: 'rgba(38, 230, 255, 0.20)', filter: 'blur(100px)' }}
            />

            {/* Card — max-w-xl, z-10 */}
            <div className="w-full max-w-xl z-10">
                {/* bg-surface-container-lowest = #ffffff, rounded-xl = 2rem (Stitch borderRadius), tonal-shadow */}
                <div
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-white/40"
                    style={{ boxShadow: '0 32px 64px -12px rgba(42, 43, 81, 0.06)' }}
                >
                    {/* ── Heading block ── */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-4xl font-extrabold text-[#2a2b51] tracking-tight mb-2 leading-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Tham gia ZSocial
                        </h1>
                        <p
                            className="text-[#575881] font-medium"
                            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        >
                            Khám phá cộng đồng sáng tạo dành cho bạn
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <form className="space-y-6" onSubmit={onSubmit}>

                        {/* Row 1: Họ và tên + Tên đăng nhập */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Họ và tên */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                >
                                    Họ và tên
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                        person
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 placeholder:text-[#72739e] outline-none text-[#2a2b51]"
                                        name="fullName"
                                        placeholder="Nguyễn Văn A"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tên đăng nhập */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                >
                                    Tên đăng nhập
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                        alternate_email
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 placeholder:text-[#72739e] outline-none text-[#2a2b51]"
                                        name="username"
                                        placeholder="ten_dang_nhap"
                                        type="text"
                                        value={formData.username}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Giới tính + Ngày sinh */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Giới tính */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                >
                                    Giới tính
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                        wc
                                    </span>
                                    <select
                                        className="w-full pl-12 pr-10 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 appearance-none text-[#2a2b51] outline-none"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={onChange}
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#72739e] pointer-events-none">
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                >
                                    Ngày sinh
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                        calendar_today
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 text-[#2a2b51] outline-none"
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                            >
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                    lock
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 placeholder:text-[#72739e] outline-none text-[#2a2b51]"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="space-y-2">
                            <label
                                className="block text-sm font-bold text-[#575881] tracking-wide px-1"
                                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                            >
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72739e]">
                                    lock_reset
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-4 bg-[#f2efff] border-none rounded-full focus:ring-2 focus:ring-[#004be2]/20 focus:bg-white transition-all duration-200 placeholder:text-[#72739e] outline-none text-[#2a2b51]"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                className="cursor-pointer w-full py-4 text-[#f2f1ff] font-bold rounded-full text-lg active:scale-[0.98] transition-all"
                                style={{
                                    fontFamily: "'Be Vietnam Pro', sans-serif",
                                    background: 'linear-gradient(135deg, #004be2 0%, #809bff 100%)',
                                    boxShadow: '0 8px 30px -8px rgba(0, 75, 226, 0.35)',
                                }}
                                type="submit"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>

                    {/* ── Login link ── */}
                    <div className="mt-10 text-center">
                        <p
                            className="text-[#575881] font-medium text-sm"
                            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        >
                            Đã có tài khoản?{' '}
                            <Link
                                to="/login"
                                className="text-[#004be2] font-bold ml-1 hover:underline underline-offset-4"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RegisterForm;
