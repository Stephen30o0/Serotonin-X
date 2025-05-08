import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { SendIcon } from 'lucide-react';
interface ContactPageProps {
  setCursorType: (type: string) => void;
  cursorPosition: {
    x: number;
    y: number;
  };
}
const ContactPage: React.FC<ContactPageProps> = ({
  setCursorType,
  cursorPosition
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formState);
  };
  return <div className="relative min-h-screen pt-32 pb-20">
      <ParticleBackground cursorPosition={cursorPosition} />
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] mb-12">
            CONTACT
          </h2>
          <div className="space-y-12">
            <div className="prose prose-invert">
              <p className="text-lg font-light leading-relaxed">
                Interested in collaborating or commissioning an installation?
                We'd love to hear from you.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300" value={formState.name} onChange={e => setFormState({
                  ...formState,
                  name: e.target.value
                })} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
                </div>
                <div>
                  <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300" value={formState.email} onChange={e => setFormState({
                  ...formState,
                  email: e.target.value
                })} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
                </div>
                <div>
                  <textarea placeholder="Message" rows={5} className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors duration-300 resize-none" value={formState.message} onChange={e => setFormState({
                  ...formState,
                  message: e.target.value
                })} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
                </div>
              </div>
              <button type="submit" className="group flex items-center space-x-2 text-sm tracking-wider" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
                <span className="border-b border-transparent group-hover:border-cyan-400 transition-colors duration-300">
                  SEND MESSAGE
                </span>
                <SendIcon size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
            <div className="pt-12 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm tracking-wider text-gray-400 mb-2">
                    LOCATION
                  </h3>
                  <p className="font-light">
                    Kigali, Rwanda
                    <br />
                    +250790803794, Rwanda
                  </p>
                </div>
                <div>
                  <h3 className="text-sm tracking-wider text-gray-400 mb-2">
                    EMAIL
                  </h3>
                  <p className="font-light">koreolurinola@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ContactPage;