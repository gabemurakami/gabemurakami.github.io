class WaveformGenerator {
    constructor(canvasId, waveType) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.waveType = waveType;
        this.offset = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    drawMetabolic(x, y, amplitude) {

        // P wave
        this.ctx.lineTo(x + 10, y - amplitude * 0.06);
        this.ctx.lineTo(x + 20, y);

        // Q wave
        this.ctx.lineTo(x + 25, y + amplitude * 0.3);

        // R wave (spike)
        this.ctx.lineTo(x + 30, y - amplitude * 0.9);

        // S wave
        this.ctx.lineTo(x + 35, y + amplitude * 0.055);

        // ST segment
        this.ctx.lineTo(x + 50, y);

        // T wave
        this.ctx.lineTo(x + 60, y - amplitude * 0.25);
        this.ctx.lineTo(x + 70, y);

    }

    drawNervous(x, y, amplitude) {

        // P wave
        this.ctx.lineTo(x + 10, y - amplitude * 0.08);
        this.ctx.lineTo(x + 20, y);

        // R wave (spike)
        this.ctx.lineTo(x + 32, y - amplitude * 0.4);

        // S wave
        this.ctx.lineTo(x + 35, y + amplitude * 0.01);

    }

    drawCardio(x, y, amplitude) {
        this.ctx.lineTo(x + 10, y - amplitude * 0.05);

        // Rising slope (gentler)
        this.ctx.quadraticCurveTo(
            x + 18, y - amplitude * 0.25,
            x + 28, y - amplitude * 0.45
        );

        // Rounded peak (key part)
        this.ctx.quadraticCurveTo(
            x + 35, y - amplitude * 0.62,
            x + 42, y - amplitude * 0.6
        );

        // Descending slope (mirror of rise)
        this.ctx.quadraticCurveTo(
            x + 50, y - amplitude * 0.45,
            x + 55, y
        );

        // Lower dip
        this.ctx.quadraticCurveTo(
            x + 70, y + amplitude * 0.35,
            x + 80, y + amplitude * 0.15
        );

        this.ctx.quadraticCurveTo(
            x + 88, y + amplitude * 0.05,
            x + 95, y
        );

        this.ctx.lineTo(x + 200, y);
    }

    drawWave() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerY = this.canvas.height / 2;
        const amplitude = this.canvas.height * 0.35;

        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);

        switch (this.waveType) {
            case 'metabolic': {
                const beatWidth = 80;
                for (
                    let x = Math.floor(-this.offset / beatWidth) * beatWidth - beatWidth * 2;
                    x < this.canvas.width + beatWidth;
                    x += beatWidth
                ) {
                    const adjustedX = x + this.offset;
                    this.drawMetabolic(adjustedX, centerY, amplitude);
                }
                break;
            }

            case 'cardio': {
                const beatWidth = 200;
                for (
                    let x = -beatWidth * 2;
                    x < this.canvas.width + beatWidth;
                    x += beatWidth
                ) {
                    const adjustedX = x + this.offset;
                    this.drawCardio(adjustedX, centerY, amplitude);
                }
                break;
            }

            case 'nervous': {
                const beatWidth = 100;
                for (
                    let x = Math.floor(-this.offset / beatWidth) * beatWidth - beatWidth * 4;
                    x < this.canvas.width + beatWidth;
                    x += beatWidth
                ) {
                    const adjustedX = x + this.offset;
                    this.drawNervous(adjustedX, centerY, amplitude);
                }
                break;
            }

            case 'respiratory':
                for (let x = 0; x < this.canvas.width; x++) {
                    const adjustedX = x + this.offset;
                    const y = centerY + Math.sin(adjustedX * 0.04) * amplitude * 0.7;
                    this.ctx.lineTo(x, y);
                }
                break;

            case 'square':
                for (let x = 0; x < this.canvas.width; x++) {
                    const adjustedX = x + this.offset;
                    const cycle = Math.floor(adjustedX / 100) % 3;
                    let y =
                        cycle === 0
                            ? centerY - amplitude * 0.5
                            : cycle === 1
                                ? centerY
                                : centerY - amplitude * 0.3;
                    this.ctx.lineTo(x, y);
                }
                break;

            case 'erratic':
                for (let x = 0; x < this.canvas.width; x += 3) {
                    const adjustedX = x + this.offset;
                    const y =
                        centerY +
                        Math.sin(adjustedX * 0.1) * amplitude * 0.4 +
                        (Math.random() - 0.5) * amplitude * 0.5;
                    this.ctx.lineTo(x, y);
                }
                break;
        }

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(230, 255, 245, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = 'rgba(230, 255, 245, 0.7)';
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        this.ctx.restore();
    }

    animate() {
        this.offset += 0.5;
        if (this.waveType === 'ecg' && this.offset > 80) {
            this.offset = 0;
        } else if (this.waveType === 'metabolic' && this.offset > 200) {
            this.offset = 0;
        } else if (this.waveType === 'nervous' && this.offset > 100) {
            this.offset = 0;
        } else if (this.offset > 1000) {
            this.offset = 0;
        }
        this.drawWave();
        requestAnimationFrame(() => this.animate());
    }
}

new WaveformGenerator('cardio', 'cardio');
new WaveformGenerator('metabolic', 'metabolic');
// new WaveformGenerator('nervous', 'nervous');
// new WaveformGenerator('pulmonary', 'respiratory');
// new WaveformGenerator('systems', 'square');
// new WaveformGenerator('locomotor', 'erratic');