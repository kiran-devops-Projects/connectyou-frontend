import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Star, Users, BookOpen, Trophy, Sparkles } from 'lucide-react';

const AnimatedLandingPage = () => {
  const [showCards, setShowCards] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);

  // Slideshow data
  const slides = [
    {
      title: "Connect with Industry Leaders",
      subtitle: "Bridge the gap between students and professionals",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-blue-600 to-purple-700"
    },
    {
      title: "Unlock Career Opportunities",
      subtitle: "Get mentorship from successful alumni",
      image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-purple-600 to-pink-700"
    },
    {
      title: "Build Your Professional Network",
      subtitle: "Create lasting connections for your future",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-pink-600 to-orange-700"
    }
  ];

  const features = [
    { icon: Users, title: "Alumni Network", desc: "Connect with 10,000+ alumni worldwide" },
    { icon: BookOpen, title: "Mentorship", desc: "Get guidance from industry experts" },
    { icon: Trophy, title: "Career Growth", desc: "Accelerate your professional journey" },
    { icon: Sparkles, title: "Opportunities", desc: "Access exclusive job openings" }
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Software Engineer at Google", quote: "ConnectYou helped me land my dream job through alumni connections!" },
    { name: "Michael Chen", role: "Product Manager at Meta", quote: "The mentorship I received was invaluable for my career growth." },
    { name: "Emily Davis", role: "Data Scientist at Netflix", quote: "Amazing platform that truly bridges students with industry professionals." }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 1000);
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      clearInterval(slideTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleExploreClick = () => {
    setShowCards(true);
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ConnectYou
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Features', 'Alumni', 'About'].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Slideshow Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-90`}
          />
          <img
            src={slides[currentSlide].image}
            alt="Hero"
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
            style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
          />
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div 
            key={currentSlide}
            className="animate-in slide-in-from-bottom-8 duration-1000"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block animate-in slide-in-from-left-8 duration-1000 delay-200">
                {slides[currentSlide].title.split(' ')[0]}
              </span>
              <br />
              <span className="inline-block animate-in slide-in-from-right-8 duration-1000 delay-400 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                {slides[currentSlide].title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-in fade-in duration-1000 delay-600 text-gray-200">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-800">
              <button 
                onClick={handleExploreClick}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Explore Platform
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Slide Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Alumni Connected', delay: 0 },
              { number: '5K+', label: 'Students Mentored', delay: 200 },
              { number: '2K+', label: 'Success Stories', delay: 400 },
              { number: '95%', label: 'Satisfaction Rate', delay: 600 }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-in fade-in slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ConnectYou</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Transform your career journey with our comprehensive platform designed to connect students with industry professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer ${
                  showCards ? 'animate-in fade-in slide-in-from-bottom-8' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Hear from our community members who achieved their dreams
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-white mb-6 text-lg italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Ready to 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Transform</span>
            <br />Your Future?
          </h2>
          <p className="text-xl text-gray-600 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Join thousands of students and alumni already building meaningful connections
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              Start Connecting
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-12 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">ConnectYou</span>
              </div>
              <p className="text-gray-400">
                Bridging the gap between students and professionals for a better tomorrow.
              </p>
            </div>
            {[
              { title: 'Platform', items: ['Features', 'Alumni Network', 'Mentorship', 'Resources'] },
              { title: 'Company', items: ['About Us', 'Careers', 'Contact', 'Blog'] },
              { title: 'Support', items: ['Help Center', 'Privacy Policy', 'Terms of Service', 'FAQ'] }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ConnectYou. All rights reserved. Made with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .slide-in-from-bottom-4 { animation: slideInFromBottom 0.6s ease-out; transform: translateY(16px); }
        .slide-in-from-bottom-8 { animation: slideInFromBottom 0.6s ease-out; transform: translateY(32px); }
        .slide-in-from-left-8 { animation: slideInFromLeft 0.6s ease-out; transform: translateX(-32px); }
        .slide-in-from-right-8 { animation: slideInFromRight 0.6s ease-out; transform: translateX(32px); }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(var(--slide-distance, 32px)); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLandingPage;