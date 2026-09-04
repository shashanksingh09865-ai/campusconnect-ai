function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto py-5 px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © 2026 CampusConnect AI. All rights reserved.
        </p>

        <p className="text-sm text-gray-400">
          Built with ❤️ using React + FastAPI + Gemini AI
        </p>
      </div>
    </footer>
  );
}

export default Footer;