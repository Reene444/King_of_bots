import React, { useRef, useEffect } from 'react';
import './Snake.css';

const Snake = ({ players, onMouseMove }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const gridSize = 20;

        const drawGrid = () => {
            context.clearRect(0, 0, canvas.width, canvas.height); // 确保清除画布
            context.strokeStyle = '#e0e0e0';
            context.lineWidth = 1;

            for (let x = 0; x <= canvas.width; x += gridSize) {
                context.moveTo(x, 0);
                context.lineTo(x, canvas.height);
            }

            for (let y = 0; y <= canvas.height; y += gridSize) {
                context.moveTo(0, y);
                context.lineTo(canvas.width, y);
            }

            context.stroke();
        };

        const drawSnake = (player) => {
            if (!player.segments || player.segments.length === 0) return; // 防止未定义的属性访问

            context.fillStyle = player.color;
            context.strokeStyle = player.color;
            context.lineWidth = 20;

            // Set shadow properties
            context.shadowBlur = 10;
            context.shadowColor = 'rgba(0, 0, 0, 0.1)';
            context.lineJoin = 'round';  // Set line join to round
            context.lineCap = 'round';   // Set line cap to round

            context.beginPath();
            context.moveTo(player.segments[0].x, player.segments[0].y);
            for (let i = 1; i < player.segments.length; i++) {
                const segment = player.segments[i];
                if (segment) {
                    context.lineTo(segment.x, segment.y);
                }
            }
            context.stroke();

            player.segments.forEach(segment => {
                if (segment) {
                    context.beginPath();
                    context.arc(segment.x, segment.y, 10, 0, 2 * Math.PI);
                    context.fill();
                }
            });

            const head = player.segments[0];
            if (head) {
                context.beginPath();
                context.arc(head.x, head.y, 10, 0, 2 * Math.PI);
                context.fill();

                const eyeOffsetX = 4;
                const eyeOffsetY = 2;
                const eyeRadius = 2;
                context.fillStyle = '#000';

                context.beginPath();
                context.arc(head.x - eyeOffsetX, head.y - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
                context.fill();

                context.beginPath();
                context.arc(head.x + eyeOffsetX, head.y - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
                context.fill();
            }

            // Reset shadow properties
            context.shadowBlur = 0;
            context.shadowColor = 'transparent';
        };
        const render = () => {
            drawGrid();
            players.forEach(player => {
                drawSnake(player);
            });
        };

        render();
    }, [players]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseMove={onMouseMove}
            className="Snake"
        ></canvas>
    );
};

export default Snake;
