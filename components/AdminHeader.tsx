interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <div className="text-3xl font-bold text-primary">ApnaCart</div>
            <span className="text-gray-500">|</span>
            <span className="text-lg font-medium text-gray-700">Admin Panel</span>
          </div>
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              ← Back to Home
            </button>
            <button 
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}















