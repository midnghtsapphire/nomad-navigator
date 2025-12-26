import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NomadTax - Master Your Global Taxes Effortlessly | Digital Nomad Tax Platform</title>
        <meta 
          name="description" 
          content="Track income across currencies, monitor residency days, and discover optimal tax strategies. Built for digital nomads and location-independent professionals." 
        />
        <meta name="keywords" content="digital nomad taxes, expat tax, international tax, remote work taxes, tax optimization, multi-currency tracking" />
        <link rel="canonical" href="https://nomadtax.com" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Dashboard />
          <Features />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
