import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    if (email) {
      setSubscribed(true);
      setEmail('');
      // Reset the subscribed state after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-indigo-600">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-indigo-100 mb-8">
            Get updates on new arrivals, special offers, and exclusive discounts.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 font-medium px-6 py-3 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="mt-4 text-indigo-100">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 