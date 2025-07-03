import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    content: 'I love the quality of the clothes. They fit perfectly and the material is excellent. The attention to detail is impressive!',
    author: 'Sarah Johnson',
    role: 'Regular Customer',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    purchaseInfo: 'Purchased 3 items',
  },
  {
    id: 2,
    content: 'The customer service is outstanding. They helped me find the perfect outfit for my event and even suggested accessories that matched perfectly.',
    author: 'Michael Chen',
    role: 'Verified Buyer',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    purchaseInfo: 'Purchased 5 items',
  },
  {
    id: 3,
    content: 'Fast shipping and the products always arrive in perfect condition. The packaging is eco-friendly too which I really appreciate. Highly recommend!',
    author: 'Emily Rodriguez',
    role: 'Loyal Customer',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    purchaseInfo: 'Purchased 12 items',
  },
];

const Testimonials = () => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">What Our Customers Say</h2>
          <p className="mt-4 text-gray-600">Don't just take our word for it — hear from our satisfied customers about their shopping experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-100 rounded-bl-full opacity-50 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-yellow-100 rounded-full opacity-50"></div>
              
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-sm text-gray-500">{testimonial.rating}.0</span>
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex items-center mt-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <span className="hidden sm:inline mx-2 text-gray-300">•</span>
                      <p className="text-xs text-indigo-600 font-medium">{testimonial.purchaseInfo}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Verification badge */}
              <div className="absolute bottom-6 right-6">
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg font-medium transition-colors duration-200">
            View All Reviews
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;