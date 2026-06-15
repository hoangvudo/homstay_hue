import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedHomestays from '@/components/home/FeaturedHomestays';
import Destinations from '@/components/home/Destinations';
import MapSection from '@/components/home/MapSection';
import Promotions from '@/components/home/Promotions';
import Reviews from '@/components/home/Reviews';
import Statistics from '@/components/home/Statistics';
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <FeaturedHomestays />
      <Destinations />
      <MapSection />
      <Promotions />
      <Reviews />
      <Statistics />
      <Footer />
    </main>
  );
}
