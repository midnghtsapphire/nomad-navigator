import { useEffect, useRef } from "react";

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const resize = () => {
      const size = Math.min(500, window.innerWidth * 0.8);
      canvas.width = size;
      canvas.height = size;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      ctx.clearRect(0, 0, width, height);

      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.3
      );
      glowGradient.addColorStop(0, "hsla(173, 80%, 40%, 0.15)");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);

      // Globe gradient
      const globeGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      globeGradient.addColorStop(0, "hsl(222, 47%, 16%)");
      globeGradient.addColorStop(0.5, "hsl(222, 47%, 10%)");
      globeGradient.addColorStop(1, "hsl(222, 47%, 6%)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeGradient;
      ctx.fill();

      // Border
      ctx.strokeStyle = "hsla(173, 80%, 40%, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Latitude lines
      ctx.strokeStyle = "hsla(173, 80%, 40%, 0.15)";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (radius * i * 0.3);
        const xOffset = Math.sqrt(radius * radius - Math.pow(radius * i * 0.3, 2));
        ctx.beginPath();
        ctx.ellipse(centerX, y, xOffset, xOffset * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (rotating)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + rotation;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          Math.abs(Math.cos(angle)) * radius,
          radius,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Dots representing cities (animated positions)
      const cities = [
        { lat: 0.3, lng: rotation },
        { lat: -0.2, lng: rotation + 1 },
        { lat: 0.5, lng: rotation + 2 },
        { lat: -0.4, lng: rotation + 3.5 },
        { lat: 0.1, lng: rotation + 4.5 },
        { lat: 0.6, lng: rotation + 5 },
      ];

      cities.forEach((city) => {
        const x = centerX + Math.sin(city.lng) * Math.cos(city.lat * Math.PI / 2) * radius * 0.9;
        const y = centerY + Math.sin(city.lat * Math.PI / 2) * radius * 0.9;
        const visible = Math.cos(city.lng) > -0.2;

        if (visible) {
          // Glow
          const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, 15);
          dotGlow.addColorStop(0, "hsla(38, 92%, 50%, 0.8)");
          dotGlow.addColorStop(1, "transparent");
          ctx.fillStyle = dotGlow;
          ctx.fillRect(x - 15, y - 15, 30, 30);

          // Dot
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "hsl(38, 92%, 50%)";
          ctx.fill();
        }
      });

      // Connection lines between visible dots
      ctx.strokeStyle = "hsla(173, 80%, 40%, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const visibleCities = cities.filter(city => Math.cos(city.lng) > -0.2);
      for (let i = 0; i < visibleCities.length - 1; i++) {
        const city1 = visibleCities[i];
        const city2 = visibleCities[i + 1];
        const x1 = centerX + Math.sin(city1.lng) * Math.cos(city1.lat * Math.PI / 2) * radius * 0.9;
        const y1 = centerY + Math.sin(city1.lat * Math.PI / 2) * radius * 0.9;
        const x2 = centerX + Math.sin(city2.lng) * Math.cos(city2.lat * Math.PI / 2) * radius * 0.9;
        const y2 = centerY + Math.sin(city2.lat * Math.PI / 2) * radius * 0.9;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      rotation += 0.003;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[500px] h-auto"
    />
  );
};

export default Globe;
