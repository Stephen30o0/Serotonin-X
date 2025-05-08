import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from '@react-three/postprocessing';
import { BloomEffect } from '@react-three/postprocessing';
interface NeuralSpaceProps {
  cursorPosition: {
    x: number;
    y: number;
  };
  audioData: Float32Array | null;
}
const NeuralSpace: React.FC<NeuralSpaceProps> = ({
  cursorPosition,
  audioData
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const neuralLinesRef = useRef<THREE.LineSegments | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  useEffect(() => {
    if (!containerRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Camera setup with dynamic perspective
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;
    // Renderer with high-quality settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      stencil: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Neural network particle system
    const createNeuralSystem = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Sphere distribution
        const radius = 25;
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);
        positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i3 + 2] = radius * Math.cos(theta);
        velocities[i3] = Math.random() * 0.02 - 0.01;
        velocities[i3 + 1] = Math.random() * 0.02 - 0.01;
        velocities[i3 + 2] = Math.random() * 0.02 - 0.01;
        // Color gradient from cyan to magenta
        colors[i3] = Math.random();
        colors[i3 + 1] = Math.random() * 0.5 + 0.5;
        colors[i3 + 2] = Math.random();
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Points(geometry, material);
    };
    // Create multiple particle systems
    const primarySystem = createNeuralSystem();
    const secondarySystem = createNeuralSystem();
    scene.add(primarySystem);
    scene.add(secondarySystem);
    particlesRef.current = [primarySystem, secondarySystem];
    // Neural connections
    const createNeuralConnections = () => {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const lines = new THREE.LineSegments(geometry, material);
      scene.add(lines);
      return lines;
    };
    neuralLinesRef.current = createNeuralConnections();
    // Animation loop
    const animate = (time: number) => {
      timeRef.current = time * 0.001;
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      // Update particles
      particlesRef.current.forEach(particles => {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particles.geometry.attributes.velocity.array as Float32Array;
        const colors = particles.geometry.attributes.color.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          // Apply velocity and forces
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          // Audio reactivity
          if (audioData && i < audioData.length) {
            const audioValue = Math.abs(audioData[i]);
            positions[i] += audioValue * 0.1;
            positions[i + 1] += audioValue * 0.1;
            colors[i] = Math.min(1, colors[i] + audioValue * 0.1);
          }
          // Mouse interaction
          const dx = positions[i] - mouseRef.current.x * 30;
          const dy = positions[i + 1] - mouseRef.current.y * 30;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 10) {
            positions[i] += dx * 0.02;
            positions[i + 1] += dy * 0.02;
            colors[i] = Math.min(1, colors[i] + 0.1);
          }
          // Boundary check with smooth wrapping
          const bound = 30;
          if (Math.abs(positions[i]) > bound) positions[i] *= -0.95;
          if (Math.abs(positions[i + 1]) > bound) positions[i + 1] *= -0.95;
          if (Math.abs(positions[i + 2]) > bound) positions[i + 2] *= -0.95;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        // Rotation based on audio
        if (audioData) {
          const avgAudio = Array.from(audioData).reduce((a, b) => a + Math.abs(b), 0) / audioData.length;
          particles.rotation.x += 0.001 + avgAudio * 0.01;
          particles.rotation.y += 0.001 + avgAudio * 0.01;
        }
      });
      // Update neural connections
      if (neuralLinesRef.current) {
        const positions = particlesRef.current[0].geometry.attributes.position.array as Float32Array;
        const linePositions: number[] = [];
        const maxDistance = 5;
        for (let i = 0; i < positions.length; i += 3) {
          for (let j = i + 3; j < positions.length; j += 3) {
            const dx = positions[i] - positions[j];
            const dy = positions[i + 1] - positions[j + 1];
            const dz = positions[i + 2] - positions[j + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < maxDistance) {
              linePositions.push(positions[i], positions[i + 1], positions[i + 2], positions[j], positions[j + 1], positions[j + 2]);
            }
          }
        }
        neuralLinesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      }
      // Add glow effect through additive blending and opacity
      rendererRef.current.setClearColor(0x000000, 0);
      rendererRef.current.render(scene, camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [audioData]);
  // Update mouse position
  useEffect(() => {
    mouseRef.current.x = cursorPosition.x / window.innerWidth * 2 - 1;
    mouseRef.current.y = -(cursorPosition.y / window.innerHeight) * 2 + 1;
  }, [cursorPosition]);
  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};
export default NeuralSpace;