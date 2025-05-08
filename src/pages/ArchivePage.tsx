import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
interface ArchivePageProps {
  setCursorType: (type: string) => void;
  cursorPosition: {
    x: number;
    y: number;
  };
}
const ArchivePage: React.FC<ArchivePageProps> = ({
  setCursorType,
  cursorPosition
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const archives = [{
    title: 'Synaptic Dreams',
    year: '2023',
    category: 'installation',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80'
  }, {
    title: 'Neural Pathways',
    year: '2022',
    category: 'exhibition',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80'
  }, {
    title: 'Digital Consciousness',
    year: '2022',
    category: 'research',
    image: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80'
  }, {
    title: 'Emotional Matrix',
    year: '2021',
    category: 'installation',
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80'
  }];
  const filters = ['all', 'installation', 'exhibition', 'research'];
  const filteredArchives = activeFilter === 'all' ? archives : archives.filter(item => item.category === activeFilter);
  return <div className="relative min-h-screen pt-32 pb-20">
      <ParticleBackground cursorPosition={cursorPosition} />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
          <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] mb-8 md:mb-0">
            ARCHIVE
          </h2>
          <div className="flex space-x-6">
            {filters.map(filter => <button key={filter} className={`text-sm tracking-wider capitalize transition-colors duration-300 ${activeFilter === filter ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveFilter(filter)} onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
                {filter}
              </button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {filteredArchives.map(item => <div key={item.title} className="group" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
              <div className="relative overflow-hidden">
                <div className="aspect-[16/9]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500 group-hover:bg-opacity-20" />
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-light tracking-wider">
                    {item.title}
                  </h3>
                  <span className="text-sm text-gray-400 capitalize">
                    {item.category}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{item.year}</span>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default ArchivePage;