import React from 'react';
import { CONTACT_INFO } from '../utils/constant';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to EcomClothes! These terms outline the rules and regulations for the use of our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. General</h2>
      <p className="mb-4">
        By accessing this website, you agree to be bound by these terms. If you disagree with any part, please do not use our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Products & Orders</h2>
      <ul className="list-disc list-inside mb-4">
        <li>All product prices are listed in INR and are inclusive of taxes.</li>
        <li>We reserve the right to cancel orders due to stock issues or incorrect pricing.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Returns & Refunds</h2>
      <p className="mb-4">
        We accept returns within 7 days of delivery. Read our Return Policy for detailed terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. User Conduct</h2>
      <p className="mb-4">
        You agree not to misuse our website or engage in any activity that disrupts its functioning.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
      <p className="mb-4">
        All content, designs, and images are the property of EcomClothes and may not be used without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Modifications</h2>
      <p className="mb-4">
        We may revise these terms at any time without notice. By using this site, you agree to be bound by the current version.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="text-gray-600 mb-4">
        For any concerns, please contact <span className="text-blue-600">{CONTACT_INFO.email}</span>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
