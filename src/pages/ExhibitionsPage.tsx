import React, { useEffect, useState, useRef } from 'react';

// This is a simplified demonstration version without react-router-dom dependencies
const ExhibitionsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeExhibition, setActiveExhibition] = useState(null);
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef(null);
  useEffect(() => {
    // Animation delay for entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Exhibition data
  const exhibitions = [{
    id: 'neural-flux',
    title: 'Neural Flux',
    description: 'An immersive installation that visualizes the flow of emotional data through synthetic neural pathways. Visitors enter a responsive environment where their movements and proximity influence the behavior of light and sound, creating a collective experience of neurological phenomena.',
    date: 'Current: May 6 - June 20, 2025',
    location: 'Serotonin X Studio, Kigali',
    image: '/api/placeholder/600/400',
    featured: true,
    status: 'current'
  }, {
    id: 'conscious-circuits',
    title: 'Conscious Circuits',
    description: 'A new installation exploring the emergence of consciousness through connected neural networks. This work introduces biometric sensors that capture visitor responses, incorporating this data into the evolving visual system.',
    date: 'Upcoming: August 5 - August 28, 2025',
    location: 'Spiral Gallery, Kigali',
    image: '/api/placeholder/600/400',
    status: 'upcoming'
  }, {
    id: 'dopamine-cycles',
    title: 'Dopamine Cycles',
    description: 'An exploration of reward pathways in the brain through circular light sculptures and rhythmic sound patterns. The installation creates feedback loops between visitors, generating increasingly complex patterns of light and sound as more people engage with the space.',
    date: 'Upcoming: September 12 - October 15, 2025',
    location: 'Kigali Media Art Biennale',
    image: '/api/placeholder/600/400',
    status: 'upcoming'
  }, {
    id: 'synaptic-field',
    title: 'Synaptic Field',
    description: 'A room-scale installation that recreates the microarchitecture of neural connections. Thousands of light points suspended in space create an environment that participants navigate through, triggering cascades of light and sound that mimic the transmission of information through the brain.',
    date: 'Past: January 15 - March 2, 2025',
    location: 'Contemporary Art Museum, Kigali',
    image: '/api/placeholder/600/400',
    status: 'past'
  }, {
    id: 'limbic-resonance',
    title: 'Limbic Resonance',
    description: 'A study of emotional contagion through networked light objects that synchronize based on proximity and interaction. The installation explores how emotions propagate through social space, creating visual evidence of our interconnected emotional states.',
    date: 'Past: October 3 - December 12, 2024',
    location: 'Media Lab, Kigali',
    image: '/api/placeholder/600/400',
    status: 'past'
  }];

  // Filter exhibitions based on selected filter
  const filteredExhibitions = filter === 'all' ? exhibitions : exhibitions.filter(e => e.status === filter);

  // Find featured exhibition or default to first one
  const featuredExhibition = exhibitions.find(e => e.featured) || exhibitions[0];

  // Set initial active exhibition
  useEffect(() => {
    if (featuredExhibition) {
      setActiveExhibition(featuredExhibition.id);
    }
  }, []);

  // Get currently active exhibition details
  const activeExhibitionData = exhibitions.find(e => e.id === activeExhibition) || featuredExhibition;
  return <div className="relative min-h-screen bg-black text-white">
      {/* Main content that will be shown as blurred background */}
      <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'} blur-sm`}>
        <div className="max-w-6xl mx-auto py-24 px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <h1 className="text-3xl md:text-5xl font-extralight tracking-widest mb-6 md:mb-0">
              Exhibitions
            </h1>

            <div className="flex space-x-6">
              <button onClick={() => setFilter('all')} className={`text-sm font-light tracking-wider py-1 border-b ${filter === 'all' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-500'}`}>
                All
              </button>
              <button onClick={() => setFilter('current')} className={`text-sm font-light tracking-wider py-1 border-b ${filter === 'current' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-500'}`}>
                Current
              </button>
              <button onClick={() => setFilter('upcoming')} className={`text-sm font-light tracking-wider py-1 border-b ${filter === 'upcoming' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-500'}`}>
                Upcoming
              </button>
              <button onClick={() => setFilter('past')} className={`text-sm font-light tracking-wider py-1 border-b ${filter === 'past' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-500'}`}>
                Past
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              {filteredExhibitions.map(exhibition => <button key={exhibition.id} className={`block text-left w-full p-4 border ${activeExhibition === exhibition.id ? 'border-white' : 'border-gray-800 hover:border-gray-600'} transition-colors duration-300`}>
                  <h3 className="text-lg font-light tracking-wide text-white mb-1">
                    {exhibition.title}
                  </h3>
                  <p className="text-sm text-gray-400">{exhibition.date}</p>
                  <p className="text-sm text-gray-400">{exhibition.location}</p>
                </button>)}
            </div>

            <div ref={scrollRef} className="md:col-span-2 space-y-6">
              {activeExhibitionData && <div className="space-y-6">
                  <div className="relative aspect-[3/2] bg-gray-900 overflow-hidden">
                    <img src={activeExhibitionData.image} alt={activeExhibitionData.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white">
                      {activeExhibitionData.title}
                    </h2>
                    <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
                      <p className="text-sm text-gray-300">
                        {activeExhibitionData.date}
                      </p>
                      <p className="text-sm text-gray-300">
                        {activeExhibitionData.location}
                      </p>
                    </div>
                    <p className="font-light text-gray-300 leading-relaxed">
                      {activeExhibitionData.description}
                    </p>

                    <div className="pt-4">
                      <a href="#" className="inline-block py-2 px-6 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
        <div className="max-w-xl w-full mx-auto px-6 py-12 bg-black/80 border border-gray-700 text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-widest text-white mb-6">
            Coming Soon
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-8">
            Our Exhibitions in Kigali, Rwanda
          </p>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            We're preparing an exceptional showcase of immersive art installations. 
            Sign up below to be notified when our exhibition calendar launches.
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center mb-8">
            <input type="email" placeholder="Your email address" className="px-4 py-3 bg-transparent border border-gray-600 text-white" />
            <button className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors">
              Notify Me
            </button>
          </div>

          <div className="mt-10 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Gallery Entrance placeholders */}
      <div className="fixed left-0 bottom-20 transform -rotate-90 origin-bottom-left z-30">
        <a href="#" className="block py-3 px-6 text-gray-400 hover:text-white text-sm tracking-widest transition-colors">
          Archive
        </a>
      </div>
      <div className="fixed right-0 bottom-20 transform rotate-90 origin-bottom-right z-30">
        <a href="#" className="block py-3 px-6 text-gray-400 hover:text-white text-sm tracking-widest transition-colors">
          Contact
        </a>
      </div>
    </div>;
};
export default ExhibitionsPage;