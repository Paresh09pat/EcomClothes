import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-4">
        At EcomClothes, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Personal information (name, email, phone number)</li>
        <li>Shipping and billing address</li>
        <li>Payment details (secured via third-party services)</li>
        <li>Browsing behavior and interaction on our website</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to process orders, improve our services, send promotional offers (with consent), and for customer support.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="mb-4">
        Your data is protected with SSL encryption and secure third-party services. We do not sell your data to anyone.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
      <p className="mb-4">
        We use cookies to personalize your experience and improve our site. You can disable them from your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
      <p className="mb-4">
        We may use services like Google Analytics or Razorpay. These services may collect user data under their own policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-4">
        If you have any questions, contact us at <span className="text-blue-600">rajesj2738@gmail.com        </span>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
