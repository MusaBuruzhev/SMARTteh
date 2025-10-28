<template>
  <div class="home">
    <Header/>
    <main>
      <div class="hero-section">
        <canvas ref="particleCanvas" class="particle-network"></canvas>
        
        <div class="floating-devices">
          <div class="device device-1">📱</div>
          <div class="device device-2">💻</div>
          <div class="device device-3">⌚️</div>
          <div class="device device-4">🔊</div>
          <div class="device device-5">📹</div>
          <div class="device device-6">💡</div>
        </div>
        
        <div class="hero-content">
          <h2>Добро пожаловать в SMART</h2>
          <p>Лучшие технологии для вашего комфорта</p>
          <router-link to="/catalog" class="cta-button">Смотреть каталог</router-link>
        </div>
        
        <div class="tech-lines">
          <div class="line line-1"></div>
          <div class="line line-2"></div>
          <div class="line line-3"></div>
        </div>

        <div class="tech-ticker">
          <div class="ticker-content">
            <span>🚀 ХОЛОДИЛЬНИК С ИГРОВОЙ ВИДЕОКАРТОЙ • ТОСТЕР С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ • УМНАЯ ЗУБНАЯ ЩЁТКА С BLUETOOTH • КОФЕМОЛКА С МАЙНИНГОМ • ПЫЛЕСОС С ДОПОЛНЕННОЙ РЕАЛЬНОСТЬЮ • МИКРОВОЛНОВКА С КРИПТОКОШЕЛЬКОМ • ФИТНЕС-БРАСЛЕТ С КВАНТОВЫМ ПРОЦЕССОРОМ • СМАРТ-ЧАСЫ С ГАЛЛЮЦИНАЦИЯМИ • РОБОТ-УБОРЩИК С ЧУВСТВОМ ЮМОРА • УМНЫЙ СВЕТИЛЬНИК С ДЕПРЕССИЕЙ • </span>
            <span>🚀 ХОЛОДИЛЬНИК С ИГРОВОЙ ВИДЕОКАРТОЙ • ТОСТЕР С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ • УМНАЯ ЗУБНАЯ ЩЁТКА С BLUETOOTH • КОФЕМОЛКА С МАЙНИНГОМ • ПЫЛЕСОС С ДОПОЛНЕННОЙ РЕАЛЬНОСТЬЮ • МИКРОВОЛНОВКА С КРИПТОКОШЕЛЬКОМ • ФИТНЕС-БРАСЛЕТ С КВАНТОВЫМ ПРОЦЕССОРОМ • СМАРТ-ЧАСЫ С ГАЛЛЮЦИНАЦИЯМИ • РОБОТ-УБОРЩИК С ЧУВСТВОМ ЮМОРА • УМНЫЙ СВЕТИЛЬНИК С ДЕПРЕССИЕЙ • </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'HomePage',
  components: {
    Header
  },
  mounted() {
    this.initParticleNetwork();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  },
  methods: {
    initParticleNetwork() {
      const canvas = this.$refs.particleCanvas;
      const ctx = canvas.getContext('2d');
      
      const setCanvasSize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      
      setCanvasSize();
      
      const particles = [];
      const particleCount = 80;
      const mouse = { x: 0, y: 0, radius: 100 };
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1;
          this.speedX = Math.random() * 1 - 0.5;
          this.speedY = Math.random() * 1 - 0.5;
          this.color = `rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          
          if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
          if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
          
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.1;
            this.y -= dy * force * 0.1;
          }
        }
        
        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      const connectParticles = () => {
        const maxDistance = 150;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              const opacity = 1 - distance / maxDistance;
              ctx.strokeStyle = `rgba(255, 107, 53, ${opacity * 0.3})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      };
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        connectParticles();
        
        this.animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
      
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      
      canvas.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
      });
      
      this.handleResize = () => {
        setCanvasSize();
      };
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
  overflow: hidden;
  position: relative;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: radial-gradient(circle at center, #2a2a2a 0%, #0c0c0c 100%);
  position: relative;
}

.particle-network {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 600px;
  z-index: 3;
  position: relative;
}

.hero-content h2 {
  font-size: 3.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-content p {
  font-size: 1.4rem;
  margin-bottom: 2.5rem;
  color: #e0e0e0;
  line-height: 1.6;
  font-weight: 300;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.cta-button {
  display: inline-block;
  padding: 1.2rem 3rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  position: relative;
  z-index: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border: none;
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(255, 107, 53, 0.6);
}

.floating-devices {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
}

.device {
  position: absolute;
  font-size: 2.8rem;
  opacity: 0.18;
  animation: float 5s ease-in-out infinite;
  z-index: 2;
  filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.3));
}

.device-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.device-2 {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.device-3 {
  bottom: 25%;
  left: 15%;
  animation-delay: 2s;
}

.device-4 {
  bottom: 15%;
  right: 10%;
  animation-delay: 3s;
}

.device-5 {
  top: 40%;
  left: 5%;
  animation-delay: 4s;
}

.device-6 {
  top: 35%;
  right: 5%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-25px) rotate(6deg);
  }
  66% {
    transform: translateY(15px) rotate(-6deg);
  }
}

.tech-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.25), transparent);
  height: 1px;
  animation: scan 6s linear infinite;
}

.line-1 {
  top: 25%;
  width: 100%;
  animation-delay: 0s;
}

.line-2 {
  top: 50%;
  width: 100%;
  animation-delay: 2s;
}

.line-3 {
  top: 75%;
  width: 100%;
  animation-delay: 4s;
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.tech-ticker {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.2), transparent);
  padding: 18px 0;
  overflow: hidden;
  z-index: 2;
  border-top: 2px solid rgba(255, 107, 53, 0.4);
  border-bottom: 2px solid rgba(255, 107, 53, 0.4);
  backdrop-filter: blur(5px);
}

.ticker-content {
  display: flex;
  white-space: nowrap;
  animation: ticker 25s linear infinite;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ticker-content span {
  display: inline-block;
  padding-right: 60px;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.tech-ticker:hover .ticker-content {
  animation-play-state: paused;
  color: #ff6b35;
  text-shadow: 0 0 15px rgba(255, 107, 53, 0.8);
}

.hero-section::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.15) 2px, transparent 0),
    radial-gradient(circle at 80% 70%, rgba(255, 107, 53, 0.15) 2px, transparent 0),
    radial-gradient(circle at 40% 80%, rgba(255, 107, 53, 0.15) 2px, transparent 0),
    radial-gradient(circle at 60% 20%, rgba(255, 107, 53, 0.15) 2px, transparent 0);
  background-size: 100% 100%;
  animation: pulse 3s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2.8rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
  }
  
  .device {
    font-size: 2.2rem;
  }
  
  .tech-ticker {
    bottom: 20px;
    padding: 12px 0;
  }
  
  .ticker-content {
    font-size: 0.9rem;
    animation-duration: 20s;
  }
  
  .device-1,
  .device-2,
  .device-3,
  .device-4,
  .device-5,
  .device-6 {
    display: none;
  }
  
  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
}
</style>