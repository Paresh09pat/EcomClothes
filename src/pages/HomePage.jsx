import Hero from '../components/common/Hero';
import FeaturedCategories from '../components/common/FeaturedCategories';
import FeaturedProducts from '../components/common/FeaturedProducts';
import Testimonials from '../components/common/Testimonials';
import Newsletter from '../components/common/Newsletter';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <Testimonials />
      {/* <Newsletter /> */}
    </div>
  );
};

export default HomePage; 