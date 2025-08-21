'use client'

interface CartSelectionProps {
  selectedCart: 'small' | 'family' | null
  onCartSelect: (cartType: 'small' | 'family') => void
}

export default function CartSelection({ selectedCart, onCartSelect }: CartSelectionProps) {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🛒 Choose Your Cart Size
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the basket size that fits your family's needs. Each cart has a specific weight limit to ensure fresh delivery.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto px-4 md:px-0">
        {/* Small Cart */}
        <div 
          className={`relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            selectedCart === 'small'
              ? 'border-green-500 bg-white/90 backdrop-blur-md shadow-2xl'
              : 'border-green-200 bg-white/80 backdrop-blur-sm hover:border-green-400 shadow-lg hover:shadow-xl'
          }`}
          onClick={() => onCartSelect('small')}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Selection Indicator */}
          {selectedCart === 'small' && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-sm">✓</span>
            </div>
          )}
          
          <div className="relative text-center">
            <div className="text-6xl mb-6 transition-transform duration-300 hover:scale-110">
              🧺
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Small Cart
            </h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
              ₹349
            </div>
            <p className="text-gray-600 text-base mb-4">
              Perfect for small families or weekly shopping
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Up to 4.5 kg
            </div>
            
            {selectedCart === 'small' && (
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white shadow-lg">
                  ✅ Selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Family Cart */}
        <div 
          className={`relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            selectedCart === 'family'
              ? 'border-green-500 bg-white/90 backdrop-blur-md shadow-2xl'
              : 'border-green-200 bg-white/80 backdrop-blur-sm hover:border-green-400 shadow-lg hover:shadow-xl'
          }`}
          onClick={() => onCartSelect('family')}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Selection Indicator */}
          {selectedCart === 'family' && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-sm">✓</span>
            </div>
          )}
          
          <div className="relative text-center">
            <div className="text-6xl mb-6 transition-transform duration-300 hover:scale-110">
              🛒
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Family Cart
            </h3>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
              ₹559
            </div>
            <p className="text-gray-600 text-base mb-4">
              Ideal for larger families or extended shopping
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Up to 7 kg
            </div>
            
            {selectedCart === 'family' && (
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white shadow-lg">
                  ✅ Selected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
