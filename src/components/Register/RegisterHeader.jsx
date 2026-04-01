import { Link } from "react-router-dom";

function RegisterHeader() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
            {/* Logo */}
            <div
                className="text-2xl font-black tracking-tighter text-blue-600"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <Link to="/">ZSocial</Link>
            </div>

            {/* Help */}
            <div className="flex items-center gap-2 text-[#575881] hover:opacity-80 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
                <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                >
                    Trợ giúp
                </span>
            </div>
        </header>
    );
}

export default RegisterHeader;
