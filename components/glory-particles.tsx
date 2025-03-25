"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GloryParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Ensure we have valid dimensions
      const width =
        window.innerWidth || document.documentElement.clientWidth || 1;
      const height =
        window.innerHeight || document.documentElement.clientHeight || 1;

      canvas.width = width;
      canvas.height = height;
      setIsMobile(width < 768);

      // Mark canvas as ready after dimensions are set
      setCanvasReady(true);
    };

    // Initialize canvas size
    updateCanvasSize();

    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      scatteredColor: string;
      life: number;
    }[] = [];

    let textImageData: ImageData | null = null;

    function createTextImage() {
      if (!ctx || !canvas) return 0;

      // Safety check for canvas dimensions
      if (canvas.width <= 0 || canvas.height <= 0) {
        console.error(
          "Invalid canvas dimensions:",
          canvas.width,
          canvas.height
        );
        return 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set font properties
      const fontSize = isMobile
        ? Math.min(canvas.width * 0.2, 40)
        : Math.min(canvas.width * 0.25, 140);
      const fontFamily = "Georgia, serif";
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add a subtle shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // Measure text to center it
      const text = "Glory's Project Combo";
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;

      // Fill with gradient
      const gradient = ctx.createLinearGradient(
        canvas.width / 2 - textWidth / 2,
        canvas.height / 2 - fontSize / 2,
        canvas.width / 2 + textWidth / 2,
        canvas.height / 2 + fontSize / 2
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#f0f0f0");
      ctx.fillStyle = gradient;

      // Draw the text
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      try {
        // Get image data for particle creation
        textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error("Error getting image data:", error);
        return 0;
      }

      return fontSize / 100; // Return a scale factor
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null;

      const data = textImageData.data;

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);

        // Safety check for array bounds
        const index = (y * canvas.width + x) * 4 + 3;
        if (index >= 0 && index < data.length && data[index] > 128) {
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 2 + 0.5,
            color: "#ffffff",
            scatteredColor: "#f0f0f0",
            life: Math.random() * 100 + 50,
          };
        }
      }

      return null;
    }

    function createInitialParticles(scale: number) {
      if (!textImageData) return;

      const baseParticleCount = 10000; // Increased for better text definition
      const particleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      );
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale);
        if (particle) particles.push(particle);
      }
    }

    let animationFrameId: number;

    function animate(scale: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a gradient background
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      bgGradient.addColorStop(0, "#3a0ca3"); // Deep purple
      bgGradient.addColorStop(1, "#4361ee"); // Royal blue
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = 240;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < maxDistance &&
          (isTouchingRef.current || !("ontouchstart" in window))
        ) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * force * 60;
          const moveY = Math.sin(angle) * force * 60;
          p.x = p.baseX - moveX;
          p.y = p.baseY - moveY;

          // Add a subtle glow effect when particles are scattered
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
          ctx.shadowBlur = 5;
          ctx.globalAlpha = 0.9;
        } else {
          p.x += (p.baseX - p.x) * 0.1;
          p.y += (p.baseY - p.y) * 0.1;
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        // Reset shadow and alpha
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        p.life--;
        if (p.life <= 0) {
          const newParticle = createParticle(scale);
          if (newParticle) {
            particles[i] = newParticle;
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      const baseParticleCount = 10000;
      const targetParticleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      );
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale);
        if (newParticle) particles.push(newParticle);
      }

      animationFrameId = requestAnimationFrame(() => animate(scale));
    }

    // Only initialize particles after canvas is ready
    if (canvasReady) {
      const scale = createTextImage();
      createInitialParticles(scale);
      animate(scale);
    }

    const handleResize = () => {
      updateCanvasSize();
      // Only recreate particles if canvas is ready
      if (canvasReady) {
        const newScale = createTextImage();
        particles = [];
        createInitialParticles(newScale);
      }
    };

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = () => {
      isTouchingRef.current = true;
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      mousePositionRef.current = { x: 0, y: 0 };
    };

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, canvasReady]);

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-[#3a0ca3] to-[#4361ee]">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with the word Glory"
      />

      <div className="absolute bottom-[150px] text-center z-10 flex flex-row gap-4">
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-sm sm:text-base hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/tetris")}
        >
          Tetris
        </button>
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-sm sm:text-base hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/tic-tac-toe")}
        >
          Tic-Tac-Toe
        </button>
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-xl text-sm sm:text-base hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/calculator")}
        >
          Calculator
        </button>
      </div>

      <div className="absolute bottom-[100px] text-center z-10">
        <p className="font-serif text-white/70 text-xs sm:text-base md:text-sm">
          <span className="text-white/90 hover:text-white transition-colors duration-300">
            Move your cursor or touch to interact
          </span>
        </p>
      </div>
    </div>
  );
}
