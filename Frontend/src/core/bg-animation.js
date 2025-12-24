export class AuroraBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on base
        this.orbs = [];
        this.resize();

        // Configuration
        this.config = {
            orbCount: 5,
            minRadius: 300,
            maxRadius: 600,
            speed: 0.5,
            colors: [
                [15, 23, 42],    // Slate 900 (Dark Base)
                [17, 94, 89],    // Teal 800
                [159, 18, 57],   // Rose 800
                [49, 46, 129],   // Indigo 900
                [6, 78, 59]      // Emerald 900
            ]
        };

        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    init() {
        this.orbs = [];
        for (let i = 0; i < this.config.orbCount; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: this.config.minRadius + Math.random() * (this.config.maxRadius - this.config.minRadius),
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                color: this.config.colors[i % this.config.colors.length]
            });
        }
    }

    animate() {
        // Clear with base color (Dark Slate)
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Update and Draw Orbs
        this.orbs.forEach(orb => {
            // Move
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Bounce
            if (orb.x < -orb.radius || orb.x > this.width + orb.radius) orb.vx *= -1;
            if (orb.y < -orb.radius || orb.y > this.height + orb.radius) orb.vy *= -1;

            // Draw Gradient
            const gradient = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
            const [r, g, b] = orb.color;
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`); // Core
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);   // Edge

            this.ctx.globalCompositeOperation = 'screen'; // Blend mode for glowing effect
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalCompositeOperation = 'source-over'; // Reset
        requestAnimationFrame(this.animate);
    }
}
