import { X } from 'lucide-react';
import { useState } from 'react';

const SizeGuide = ({ isOpen, onClose, product }) => {
  const [activeTab, setActiveTab] = useState(product.category === 'Women' ? 'women' : 'men'); // Default to women's tab

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 max-h-[95vh] overflow-y-auto">
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

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'women' ? (
            // Women's Size Charts
            <div className="flex justify-center items-center">
              <img 
                src={"/sizeChart.webp"} 
                alt="Women's Size Chart" 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm"
                style={{ maxHeight: '60vh' }}
              />
            </div>
          ) : (
            // Men's Size Charts
            <div className="flex justify-center items-center">
              <img 
                src={"/sizeChart.webp"} 
                alt="Men's Size Chart" 
                className="w-full h-auto max-w-full object-contain rounded-lg shadow-sm"
                style={{ maxHeight: '60vh' }}
              />
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
