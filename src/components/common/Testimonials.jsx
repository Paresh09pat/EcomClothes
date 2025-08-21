import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const testimonials = [
  // Indian user testimonials
  {
    id: 1,
    content: 'Mujhe clothes ki quality bahut pasand aayi। Perfect fit mila aur material excellent hai। Attention to detail impressive hai!',
    author: 'Riya Sharma',
    role: 'Regular Customer',
    rating: 4.5,
  },
  {
    id: 2,
    content: 'Customer service outstanding hai। Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Arjun Patel',
    role: 'Verified Buyer',
    rating: 5,
  },
  {
    id: 3,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend करती हूं!',
    author: 'Kavya Nair',
    role: 'Loyal Customer',
    rating: 4,
  },
  
  // Indian user testimonials
  {
    id: 4,
    content: 'बहुत अच्छी quality के clothes मिले। Perfect fit और material excellent है। Delivery भी time पर हुई।',
    author: 'Priya Sharma',
    role: 'Verified Buyer',
    rating: 4.5,
  },
  {
    id: 5,
    content: 'Customer service bahut accha hai. Unhone meri event ke liye perfect outfit find karne में help की। Accessories भी suggest किए।',
    author: 'Rajesh Kumar',
    role: 'Regular Customer',
    rating: 3.5,
  },
  {
    id: 6,
    content: 'Fast delivery and products perfect condition में आए। Packaging eco-friendly है जो मुझे बहुत पसंद आया। Highly recommend करता हूं!',
    author: 'Anjali Patel',
    role: 'Loyal Customer',
    rating: 5,
  },
  {
    id: 7,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Vikram Singh',
    role: 'Verified Buyer',
    rating: 4,
  },
  {
    id: 8,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Meera Reddy',
    role: 'Regular Customer',
    rating: 4.5,
  },
  {
    id: 9,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Arjun Mehta',
    role: 'Loyal Customer',
    rating: 5,
  },
  {
    id: 10,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Kavya Iyer',
    role: 'Verified Buyer',
    rating: 3.5,
  },
  {
    id: 11,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Rahul Verma',
    role: 'Regular Customer',
    rating: 4,
  },
  {
    id: 12,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Zara Khan',
    role: 'Loyal Customer',
    rating: 4.5,
  },
  {
    id: 13,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Aditya Sharma',
    role: 'Verified Buyer',
    rating: 5,
  },
  {
    id: 14,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Neha Gupta',
    role: 'Regular Customer',
    rating: 3.5,
  },
  {
    id: 15,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Siddharth Malhotra',
    role: 'Loyal Customer',
    rating: 4,
  },
  {
    id: 16,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Ishita Patel',
    role: 'Verified Buyer',
    rating: 4.5,
  },
  {
    id: 17,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Vivek Singh',
    role: 'Regular Customer',
    rating: 3.5,
  },
  {
    id: 18,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Ananya Reddy',
    role: 'Loyal Customer',
    rating: 4,
  },
  {
    id: 19,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Rohan Mehta',
    role: 'Verified Buyer',
    rating: 5,
  },
  {
    id: 20,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Pooja Iyer',
    role: 'Regular Customer',
    rating: 4.5,
  },
  {
    id: 21,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Karan Verma',
    role: 'Loyal Customer',
    rating: 3.5,
  },
  {
    id: 22,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Tanvi Sharma',
    role: 'Verified Buyer',
    rating: 4,
  },
  {
    id: 23,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Aryan Patel',
    role: 'Regular Customer',
    rating: 4.5,
  },
  {
    id: 24,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Kiara Malhotra',
    role: 'Loyal Customer',
    rating: 5,
  },
  {
    id: 25,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Dhruv Singh',
    role: 'Verified Buyer',
    rating: 3.5,
  },
  {
    id: 26,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Aisha Khan',
    role: 'Regular Customer',
    rating: 4,
  },
  {
    id: 27,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Vedant Mehta',
    role: 'Loyal Customer',
    rating: 4.5,
  },
  {
    id: 28,
    content: 'Clothes ki quality bahut acchi hai. Perfect fit milta hai aur material excellent hai. Attention to detail impressive hai!',
    author: 'Myra Reddy',
    role: 'Verified Buyer',
    rating: 5,
  },
  {
    id: 29,
    content: 'Customer service outstanding hai. Unhone meri event ke liye perfect outfit find karne में help की aur accessories भी suggest किए।',
    author: 'Arnav Iyer',
    role: 'Regular Customer',
    rating: 3.5,
  },
  {
    id: 30,
    content: 'Fast shipping aur products perfect condition में आते हैं। Packaging eco-friendly है जो मुझे बहुत पसंद आता है। Highly recommend!',
    author: 'Zara Sharma',
    role: 'Loyal Customer',
    rating: 4,
  },
];

const Testimonials = () => {
  const [visibleRows, setVisibleRows] = useState(1);
  const itemsPerRow = 4; // Show 4 testimonials per row
  const totalRows = Math.ceil(testimonials.length / itemsPerRow);
  const visibleTestimonials = testimonials.slice(0, visibleRows * itemsPerRow);

  const showMore = () => {
    setVisibleRows(prev => Math.min(prev + 2, totalRows));
  };

  const showLess = () => {
    setVisibleRows(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < Math.floor(rating);
      const isHalfFilled = index === Math.floor(rating) && rating % 1 !== 0;
      
      return (
        <div key={index} className="relative">
          <StarIcon className="h-4 w-4 text-gray-300" />
          {isFilled && (
            <StarIcon className="h-4 w-4 text-yellow-400 absolute top-0 left-0" />
          )}
          {isHalfFilled && (
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900">What Our Customers Say</h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Don't just take our word for it — hear from our satisfied customers about their shopping experience</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {visibleTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 h-16 sm:h-20 lg:h-24 w-16 sm:w-20 lg:w-24 bg-indigo-100 rounded-bl-full opacity-50 transform translate-x-4 sm:translate-x-6 lg:translate-x-8 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8 group-hover:translate-x-2 sm:group-hover:translate-x-4 lg:group-hover:translate-x-6 group-hover:-translate-y-2 sm:group-hover:-translate-y-4 lg:group-hover:-translate-y-6 transition-transform duration-500"></div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 h-12 sm:h-16 w-12 sm:w-16 bg-yellow-100 rounded-full opacity-50"></div>
              
              {/* Quote icon */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="sm:w-10 sm:h-10">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-3 sm:mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-xs sm:text-sm text-gray-500">{testimonial.rating}</span>
                </div>
                
                <p className="text-gray-700 mb-4 sm:mb-6 italic text-sm sm:text-base leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center mt-4 sm:mt-6">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.author}</h4>
                                         <div className="flex flex-col sm:flex-row sm:items-center">
                       <p className="text-xs sm:text-sm text-gray-600 truncate">{testimonial.role}</p>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Verification badge */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
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
        
        {/* Show More/Less Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16">
          {visibleRows < totalRows && (
            <button
              onClick={showMore}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              Show More Reviews ({visibleRows * itemsPerRow} of {testimonials.length})
            </button>
          )}
          
          {visibleRows > 1 && (
            <button
              onClick={showLess}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              Show Less
            </button>
          )}
        </div>
        
        {/* Progress indicator */}
        {totalRows > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: totalRows }, (_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index < visibleRows ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;