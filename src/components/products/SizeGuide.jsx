import { X } from 'lucide-react';
import { useState } from 'react';

const SizeGuide = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('women'); // Default to women's tab

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Size Chart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close size guide"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Gender Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'women'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Women's Sizes
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'men'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Men's Sizes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'women' ? (
            // Women's Size Charts
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Women's KURTA Size Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Women's KURTA
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">Size</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">BUST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">WAIST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">HIPS</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">LENGTH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["XS", 32, 26, 36, 36],
                        ["S", 34, 28, 38, 37],
                        ["M", 36, 30, 38, 38],
                        ["L", 38, 32, 40, 39],
                        ["XL", 40, 34, 42, 40],
                        ["2XL", 42, 36, 44, 41],
                        ["3XL", 44, 38, 46, 42],
                      ].map(([size, bust, waist, hips, length]) => (
                        <tr key={size} className="even:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900 text-center">{size}</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{bust}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{waist}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{hips}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Women's PANT Size Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Women's PANT
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">Size</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">WAIST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">HIPS</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">LENGTH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["XS", 26, 36, 38],
                        ["S", 28, 38, 38],
                        ["M", 30, 38, 38],
                        ["L", 32, 40, 38],
                        ["XL", 34, 42, 38],
                        ["2XL", 36, 44, 38],
                        ["3XL", 38, 46, 38],
                      ].map(([size, waist, hips, length]) => (
                        <tr key={size} className="even:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900 text-center">{size}</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{waist}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{hips}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // Men's Size Charts
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Men's KURTA Size Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Men's KURTA
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">Size</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">CHEST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">WAIST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">LENGTH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["S", 36, 30, 40],
                        ["M", 38, 32, 41],
                        ["L", 40, 34, 42],
                        ["XL", 42, 36, 43],
                        ["2XL", 44, 38, 44],
                        ["3XL", 46, 40, 45],
                        ["4XL", 48, 42, 46],
                      ].map(([size, chest, waist, length]) => (
                        <tr key={size} className="even:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900 text-center">{size}</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{chest}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{waist}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Men's PANT Size Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Men's PANT
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">Size</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">WAIST</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">LENGTH</th>
                        <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 text-center">THIGH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["S", 30, 40, 22],
                        ["M", 32, 40, 23],
                        ["L", 34, 40, 24],
                        ["XL", 36, 40, 25],
                        ["2XL", 38, 40, 26],
                        ["3XL", 40, 40, 27],
                        ["4XL", 42, 40, 28],
                      ].map(([size, waist, length, thigh]) => (
                        <tr key={size} className="even:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900 text-center">{size}</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{waist}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{length}"</td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700 text-center">{thigh}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}



          {/* Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 text-center">
              <strong>Note:</strong> All measurements are in inches. For the best fit, please measure yourself and compare with the size chart above. 
              {activeTab === 'women' ? ' Women\'s sizes are typically smaller than men\'s sizes for the same letter designation.' : ' Men\'s sizes are typically larger than women\'s sizes for the same letter designation.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
