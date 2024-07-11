import React, { useRef, useEffect } from 'react';
// import './Map.css';

const Map = (players) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const gridSize = 20;

        const drawGrid = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
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

        const render = () => {
            drawGrid();
        };

        render();
        // Add resize event listener
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [players]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="Map"
        ></canvas>
    );
};

export default Map;
