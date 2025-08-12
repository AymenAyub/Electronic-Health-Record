// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-sm font-bold text-white mb-3">MediNex</h4>
          <p className="text-gray-400 text-sm">
            Next-gen hospital management made simple and efficient.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/login" className="hover:underline">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Features
              </a>
            </li>
            <li >
              <a href="mailto:support@medinex.com" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:support@medinex.com" className="hover:underline">
              support@medinex.com
            </a>
          </p>
          <p className="text-sm">© {new Date().getFullYear()} MediNex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
