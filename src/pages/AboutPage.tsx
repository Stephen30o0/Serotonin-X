import React from 'react';
import ParticleBackground from '../components/ParticleBackground';

interface AboutPageProps {
  setCursorType: (type: string) => void;
  cursorPosition: {
    x: number;
    y: number;
  };
}

const AboutPage: React.FC<AboutPageProps> = ({
  setCursorType,
  cursorPosition
}) => {
  // Use local image from public folder
  const team = [{
    name: 'Olurinola Olukorede',
    role: 'Creative Director',
    image: '/korede.jpg' // <-- Local image in public folder
  }];
  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <ParticleBackground cursorPosition={cursorPosition} />
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] mb-12">
            ABOUT SEROTONIN X
          </h2>
          <div className="space-y-12">
            <div className="prose prose-invert">
              <p className="text-lg font-light leading-relaxed">
                Serotonin X explores the intersection of neuroscience and
                digital art, creating immersive experiences that visualize the
                complexity of human consciousness and emotion.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Founded in Kigali in 2025, our studio combines cutting-edge
                technology with artistic expression to create installations that
                challenge the boundaries between the physical and digital
                realms.
              </p>
            </div>
            <div className="mt-24">
              <h3 className="text-2xl font-light tracking-wider mb-12">TEAM</h3>
              <div className="flex justify-center">
                {team.map(member => (
                  <div
                    key={member.name}
                    className="group max-w-xs"
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[3/4]">
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          width={300}
                          height={400}
                          className="object-cover w-full h-full filter grayscale transition-all duration-700 group-hover:grayscale-0"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="text-lg font-light tracking-wider">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
