'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Snowflakes
    const snowflakes = [];
    const maxSnowflakes = 150;

    class Snowflake {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > canvas.height) {
          this.reset();
        }

        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push(new Snowflake());
    }

    // Snow mounds on ground
    const groundSnow = [];
    for (let i = 0; i < canvas.width; i += 5) {
      groundSnow.push({
        x: i,
        height: Math.random() * 30 + 20,
        growth: 0
      });
    }

    // Stars
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.6),
        size: Math.random() * 2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        sparkle: Math.random() > 0.95
      });
    }

    // Sleighs
    const sleighs = [
      { x: -300, y: 150, speed: 2, direction: 1 },
      { x: canvas.width + 300, y: 250, speed: 1.5, direction: -1 },
      { x: -400, y: 100, speed: 1.8, direction: 1 }
    ];

    function drawMoon() {
      const gradient = ctx.createRadialGradient(canvas.width - 150, 100, 0, canvas.width - 150, 100, 60);
      gradient.addColorStop(0, 'rgba(255, 255, 240, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 220, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

      ctx.beginPath();
      ctx.arc(canvas.width - 150, 100, 60, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Moon craters
      ctx.fillStyle = 'rgba(200, 200, 180, 0.3)';
      ctx.beginPath();
      ctx.arc(canvas.width - 160, 90, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width - 140, 110, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStars() {
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (star.opacity > 1) star.opacity = 1;
        if (star.opacity < 0.2) star.opacity = 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Sparkle effect
        if (star.sparkle && Math.random() > 0.98) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - 4, star.y);
          ctx.lineTo(star.x + 4, star.y);
          ctx.moveTo(star.x, star.y - 4);
          ctx.lineTo(star.x, star.y + 4);
          ctx.stroke();
        }
      });
    }

    function drawPineTree(x, y, height) {
      const layers = 4;
      const layerHeight = height / layers;

      // Trunk
      ctx.fillStyle = '#3d2817';
      ctx.fillRect(x - 8, y, 16, 30);

      // Tree layers
      for (let i = 0; i < layers; i++) {
        const layerY = y - (i * layerHeight);
        const width = (layers - i) * 25;

        ctx.fillStyle = i % 2 === 0 ? '#0d3d0d' : '#0a330a';
        ctx.beginPath();
        ctx.moveTo(x, layerY - layerHeight);
        ctx.lineTo(x - width, layerY);
        ctx.lineTo(x + width, layerY);
        ctx.closePath();
        ctx.fill();

        // Snow on tree
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(x - width * 0.7, layerY - 2, width * 0.3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + width * 0.7, layerY - 2, width * 0.3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSleigh(x, y, direction) {
      ctx.save();
      ctx.translate(x, y);
      if (direction < 0) {
        ctx.scale(-1, 1);
      }

      // Reindeer (3 of them)
      for (let i = 0; i < 3; i++) {
        const offsetX = -150 + (i * 60);

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(offsetX, -5, 35, 15);

        // Head
        ctx.fillRect(offsetX - 15, -8, 15, 12);

        // Antlers
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(offsetX - 10, -8);
        ctx.lineTo(offsetX - 15, -18);
        ctx.moveTo(offsetX - 10, -8);
        ctx.lineTo(offsetX - 5, -16);
        ctx.moveTo(offsetX - 5, -8);
        ctx.lineTo(offsetX - 10, -18);
        ctx.moveTo(offsetX - 5, -8);
        ctx.lineTo(offsetX, -16);
        ctx.stroke();

        // Legs
        ctx.fillRect(offsetX + 5, 10, 3, 10);
        ctx.fillRect(offsetX + 20, 10, 3, 10);

        // Red nose (Rudolph on first)
        if (i === 0) {
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(offsetX - 15, -2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sleigh body
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(0, -20, 80, 30);
      ctx.fillRect(-10, -15, 10, 20);

      // Sleigh runners
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(85, 15);
      ctx.stroke();

      // Santa
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(20, -40, 30, 25);

      // Santa's face
      ctx.fillStyle = '#ffd5b5';
      ctx.beginPath();
      ctx.arc(35, -30, 12, 0, Math.PI * 2);
      ctx.fill();

      // Santa's hat
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(25, -35);
      ctx.lineTo(35, -50);
      ctx.lineTo(45, -35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(35, -50, 5, 0, Math.PI * 2);
      ctx.fill();

      // Presents in sleigh
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(45, -15, 15, 15);
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(62, -12, 12, 12);

      ctx.restore();
    }

    function drawGroundSnow() {
      ctx.fillStyle = '#f0f8ff';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 100);

      groundSnow.forEach((mound, i) => {
        if (i === 0) {
          ctx.lineTo(mound.x, canvas.height - 100 - mound.height);
        } else {
          const prevMound = groundSnow[i - 1];
          const cpX = (prevMound.x + mound.x) / 2;
          const cpY = canvas.height - 100 - (prevMound.height + mound.height) / 2;
          ctx.quadraticCurveTo(cpX, cpY, mound.x, canvas.height - 100 - mound.height);
        }
      });

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Shadows on snow
      ctx.fillStyle = 'rgba(200, 220, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 80);
      groundSnow.forEach((mound, i) => {
        if (i % 3 === 0) {
          ctx.lineTo(mound.x, canvas.height - 90 - mound.height * 0.5);
        }
      });
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    let frame = 0;

    function animate() {
      frame++;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1128');
      gradient.addColorStop(0.5, '#1a2856');
      gradient.addColorStop(1, '#2d3561');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawMoon();
      drawStars();

      // Update and draw sleighs
      sleighs.forEach(sleigh => {
        sleigh.x += sleigh.speed * sleigh.direction;

        if (sleigh.direction > 0 && sleigh.x > canvas.width + 400) {
          sleigh.x = -300;
        } else if (sleigh.direction < 0 && sleigh.x < -400) {
          sleigh.x = canvas.width + 300;
        }

        drawSleigh(sleigh.x, sleigh.y, sleigh.direction);
      });

      // Pine trees
      const treePositions = [
        { x: 100, y: canvas.height - 150, height: 100 },
        { x: 250, y: canvas.height - 140, height: 120 },
        { x: canvas.width - 200, y: canvas.height - 145, height: 110 },
        { x: canvas.width - 350, y: canvas.height - 155, height: 95 },
        { x: 450, y: canvas.height - 160, height: 105 },
      ];

      treePositions.forEach(tree => {
        drawPineTree(tree.x, tree.y, tree.height);
      });

      drawGroundSnow();

      // Update and draw snowflakes
      snowflakes.forEach(flake => {
        flake.update();
        flake.draw();
      });

      // Accumulate snow on ground slowly
      if (frame % 120 === 0) {
        groundSnow.forEach(mound => {
          if (mound.height < 50) {
            mound.height += Math.random() * 0.5;
          }
        });
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive"
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block'
        }}
      />

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 10,
        textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,100,255,0.5)',
        padding: '40px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '30px',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: '4rem',
          margin: '0 0 20px 0',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000'
        }}>
          🎅 Santa's North Pole Adventure! 🎄
        </h1>

        <p style={{
          fontSize: '1.8rem',
          margin: '20px 0',
          lineHeight: '1.6',
          color: '#FFFFFF'
        }}>
          Join Santa at his magical workshop!
        </p>

        <p style={{
          fontSize: '1.4rem',
          margin: '20px 0',
          color: '#87CEEB'
        }}>
          Last-Minute Christmas Trip ❄️ ⭐ 🦌
        </p>

        <button style={{
          fontSize: '1.8rem',
          padding: '20px 50px',
          marginTop: '30px',
          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 8px 25px rgba(255,0,0,0.5)',
          transition: 'all 0.3s ease',
          fontFamily: "'Comic Sans MS', cursive"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 35px rgba(255,0,0,0.7)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(255,0,0,0.5)';
        }}>
          🎁 BOOK YOUR TRIP NOW! 🎁
        </button>

        <div style={{
          marginTop: '30px',
          fontSize: '1.2rem',
          color: '#FFD700'
        }}>
          ⭐ Meet Santa • Feed Reindeer • Make Toys • Drink Hot Cocoa ⭐
        </div>
      </div>
    </div>
  );
}
