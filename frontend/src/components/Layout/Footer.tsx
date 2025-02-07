export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} CBT Therapy Bot. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
            <a href="/help" className="hover:text-gray-700">Help & Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 