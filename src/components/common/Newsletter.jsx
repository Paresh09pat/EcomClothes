import { useState } from 'react';
import { EnvelopeIcon, BellAlertIcon, TagIcon, GiftIcon } from '@heroicons/react/24/outline';

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

  const benefits = [
    { icon: BellAlertIcon, text: 'New arrival alerts' },
    { icon: TagIcon, text: 'Exclusive offers' },
    { icon: GiftIcon, text: 'Birthday surprises' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Image */}
            <div className="relative hidden md:block">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                <p className="text-indigo-100">Over 25,000 fashion enthusiasts have already subscribed</p>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-6">
                <EnvelopeIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Subscribe to Our Newsletter
                </h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Be the first to know about new collections, exclusive offers, and fashion tips tailored just for you.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <benefit.icon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Subscribe Now
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </form>

              {subscribed && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                  <p className="font-medium">Thank you for subscribing!</p>
                  <p>Check your email for confirmation and a special welcome discount.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;