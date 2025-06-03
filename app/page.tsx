import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Services from '@/components/sections/services';
import Programs from '@/components/sections/programs';
import Contact from '@/components/sections/contact';
import Newsletter from '@/components/sections/newsletter';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Programs />
        <Contact />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
}
