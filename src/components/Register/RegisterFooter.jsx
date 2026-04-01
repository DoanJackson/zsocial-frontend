function RegisterFooter() {
    // get year
    const year = new Date().getFullYear();
    return (
        /* <footer> */
        <footer
            className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#72739e] text-xs"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
            <div className="font-bold text-[#575881]">© {year} ZSocial.</div>
            <div className="flex gap-6">
                <a className="hover:text-[#004be2] transition-colors cursor-pointer" href="#">Quyền riêng tư</a>
                <a className="hover:text-[#004be2] transition-colors cursor-pointer" href="#">Điều khoản</a>
                <a className="hover:text-[#004be2] transition-colors cursor-pointer" href="#">An toàn</a>
                <a className="hover:text-[#004be2] transition-colors cursor-pointer" href="#">Liên hệ</a>
            </div>
        </footer>
    );
}

export default RegisterFooter;
