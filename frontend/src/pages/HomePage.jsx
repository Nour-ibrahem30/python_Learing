import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Ticker } from '../components/sections/Ticker';
import { LessonsSection } from '../components/sections/LessonsSection';
import { Roadmap } from '../components/sections/Roadmap';
import { Playground } from '../components/sections/Playground';
import { About } from '../components/sections/About';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <LessonsSection />
        <Roadmap />
        <Playground />
        <About />
      </main>
      <Footer />
    </>
  );
}
