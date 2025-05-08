import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
interface ParticleBackgroundProps {
  cursorPosition: {
    x: number;
    y: number;
  };
}
const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  cursorPosition
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const linesMeshRef = useRef<THREE.LineSegments | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const [isClicking, setIsClicking] = useState(false);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  useEffect(() => {
    if (!containerRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Create multiple particle systems
    const createParticleSystem = (count: number, size: number, color: number, speed: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100; // Increased spread
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        velocities[i3] = (Math.random() - 0.5) * speed;
        velocities[i3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i3 + 2] = (Math.random() - 0.5) * speed;
        sizes[i] = Math.random() * 2 + 0.5; // Varied sizes
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const material = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      return new THREE.Points(geometry, material);
    };
    // Create more particle systems with different characteristics
    const primaryParticles = createParticleSystem(2000, 0.3, 0xffffff, 0.03);
    const accentParticles1 = createParticleSystem(500, 0.4, 0x00ffff, 0.04);
    const accentParticles2 = createParticleSystem(500, 0.4, 0xff00ff, 0.04);
    const backgroundParticles = createParticleSystem(1000, 0.2, 0x0066ff, 0.02);
    scene.add(primaryParticles);
    scene.add(accentParticles1);
    scene.add(accentParticles2);
    scene.add(backgroundParticles);
    particlesRef.current = [primaryParticles, accentParticles1, accentParticles2, backgroundParticles];
    // Create lines for neural network effect
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);
    linesMeshRef.current = linesMesh;
    // Animation
    const animate = (time: number) => {
      timeRef.current = time * 0.001; // Convert to seconds
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      // Update particles
      particlesRef.current.forEach((particles, index) => {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particles.geometry.attributes.velocity.array as Float32Array;
        const sizes = particles.geometry.attributes.size.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          // Enhanced wave motion
          positions[i + 1] += Math.sin(timeRef.current * 0.5 + positions[i] * 0.05) * 0.04;
          // Stronger mouse influence
          const dx = positions[i] - mouseRef.current.x * 50;
          const dy = positions[i + 1] - -mouseRef.current.y * 50;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) {
            positions[i] += dx * 0.03;
            positions[i + 1] += dy * 0.03;
            // Particle size pulsing
            sizes[i / 3] = (Math.sin(timeRef.current * 2) + 2) * 0.5;
          }
          // Boundary check with smoother wrapping
          const bound = 50;
          if (Math.abs(positions[i]) > bound) positions[i] *= -0.98;
          if (Math.abs(positions[i + 1]) > bound) positions[i + 1] *= -0.98;
          if (Math.abs(positions[i + 2]) > bound) positions[i + 2] *= -0.98;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;
        // Dynamic rotation based on mouse position
        particles.rotation.x += 0.0002 * (1 + Math.abs(mouseRef.current.y));
        particles.rotation.y += 0.0002 * (1 + Math.abs(mouseRef.current.x));
      });
      // Update neural network lines
      const primaryPositions = particlesRef.current[0].geometry.attributes.position.array as Float32Array;
      const linePositions: number[] = [];
      const maxDistance = 5;
      for (let i = 0; i < primaryPositions.length; i += 3) {
        const x1 = primaryPositions[i];
        const y1 = primaryPositions[i + 1];
        const z1 = primaryPositions[i + 2];
        for (let j = i + 3; j < primaryPositions.length; j += 3) {
          const x2 = primaryPositions[j];
          const y2 = primaryPositions[j + 1];
          const z2 = primaryPositions[j + 2];
          const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
          if (dist < maxDistance) {
            linePositions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      }
      linesMeshRef.current!.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    // Handle mouse click
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(frameRef.current);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  // Update mouse position
  useEffect(() => {
    mouseRef.current.x = cursorPosition.x / window.innerWidth * 2 - 1;
    mouseRef.current.y = -(cursorPosition.y / window.innerHeight) * 2 + 1;
  }, [cursorPosition]);
  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};
export default ParticleBackground;