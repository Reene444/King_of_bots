import React, {useState, useRef, useEffect } from 'react';
import './Map.css';

const Map = ({players,GameCanvas,offset}) => {
       const canvasRef=useRef(null)
       const [viewport, setViewport] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const gridSize = 80;
      

        const drawGrid = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = '#2e2e2e';
            context.lineWidth = 1;
            // 计算偏移量
            const offsetX = viewport.x % (gridSize);
            const offsetY = viewport.y % (gridSize);
            for (let x =  offsetX; x <= canvas.width; x += gridSize) {
                context.moveTo(x, 0);
                context.lineTo(x, canvas.height);
            }

            for (let y = offsetY; y <= canvas.height; y += gridSize) {
                context.moveTo(0, y);
                context.lineTo(canvas.width, y);
            }

            context.stroke();
        };

        const render = () => {
            context.save()
            drawGrid();
            context.restore()
        };
        // 更新视口的函数
        const updateViewport = () => {
           
                setViewport({
                    x: viewport.x - offset.x,
                    y: viewport.y - offset.y
                });
            
        };

        // Add resize event listener
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateViewport();
            render();
            requestAnimationFrame(render);
        };

        handleResize()
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [offset]);

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
