import React, { useRef, useEffect } from 'react';

const GradientAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to fullscreen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Colors for gradient animation
    const colors = [
      { r: 76, g: 29, b: 149 },   // deep purple
      { r: 17, g: 24, b: 90 },    // dark blue
      { r: 128, g: 0, b: 128 },   // purple
      { r: 24, g: 3, b: 94 },     // indigo
      { r: 90, g: 24, b: 154 }    // violet
    ];

    // Gradient spots
    const spots = Array(6).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 200,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));

    // Animation settings
    let animationFrameId: number;

    const render = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0339');
      gradient.addColorStop(1, '#1a0b2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated spots
      spots.forEach(spot => {
        const grd = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, spot.radius
        );
        
        // Inner color with transparency
        grd.addColorStop(0, `rgba(${spot.color.r}, ${spot.color.g}, ${spot.color.b}, 0.4)`);
        // Outer color with transparency fading to zero
        grd.addColorStop(1, `rgba(${spot.color.r}, ${spot.color.g}, ${spot.color.b}, 0)`);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move spot
        spot.x += spot.vx;
        spot.y += spot.vy;

        // Bounce off edges
        if (spot.x < 0 || spot.x > canvas.width) spot.vx *= -1;
        if (spot.y < 0 || spot.y > canvas.height) spot.vy *= -1;
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default GradientAnimatedBackground;
