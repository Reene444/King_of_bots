import React, { useRef, useEffect } from 'react';
import './Mouse.css';
import {max, min} from "lodash/math";

const Mouse = ({ players, onMouseMove }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const drawMouse = (player) => {
            if (!player.segments || player.segments.length === 0) return;

            const head = player.segments[0];
            const bodyStart = player.segments[1];
            const bodyEnd = player.segments[player.segments.length - 1];


            // 绘制身体
            if (bodyStart && bodyEnd) {
                context.fillStyle = player.color;
                context.strokeStyle = player.color;

                const bodyCenterX = (bodyStart.x + bodyEnd.x) / 2;
                const bodyCenterY = (bodyStart.y + bodyEnd.y) / 2;
                const bodyWidth =Math.max(Math.abs(bodyStart.x - bodyEnd.x) + 10,40);
                const bodyHeight = Math.max(Math.abs(bodyStart.y - bodyEnd.y) + 10,40);

                context.beginPath();
                context.ellipse(bodyCenterX, bodyCenterY, bodyWidth / 2, bodyHeight / 2, 0, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            }

            // 绘制四肢
            if (bodyStart && bodyEnd) {
                const drawLimb = (x, y, width, height) => {
                    context.fillStyle = player.color;
                    context.strokeStyle = player.color;
                    context.beginPath();
                    context.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                };
                drawLimb(bodyStart.x - 10, bodyStart.y + 20, 5, 10);
                drawLimb(bodyStart.x + 10, bodyStart.y + 20, 5, 10);
                drawLimb(bodyEnd.x - 10, bodyEnd.y + 20, 5, 10);
                drawLimb(bodyEnd.x + 10, bodyEnd.y + 20, 5, 10);
            }

            // 绘制尾巴
            if (bodyEnd) {
                context.strokeStyle = player.color;
                context.beginPath();
                context.moveTo(bodyEnd.x, bodyEnd.y + 10);
                context.bezierCurveTo(bodyEnd.x + 10, bodyEnd.y + 20, bodyEnd.x + 20, bodyEnd.y + 20, bodyEnd.x + 30, bodyEnd.y + 10);
                context.stroke();
            }

            // 取消阴影效果
            context.shadowBlur = 0;
            context.shadowColor = 'transparent';

            // 绘制头部和耳朵
            if (head) {
                context.fillStyle = player.color;
                context.strokeStyle = player.color;

                // 绘制耳朵
                const drawEar = (x, y) => {
                    context.beginPath();
                    context.arc(x, y, 8, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                };
                drawEar(head.x - 10, head.y - 10);
                drawEar(head.x + 10, head.y - 10);

                // 绘制头部
                context.beginPath();
                context.arc(head.x, head.y, 15, 0, 2 * Math.PI);
                context.fill();
                context.stroke();

                // 绘制眼睛
                context.fillStyle = '#000';
                const drawEye = (x, y) => {
                    context.beginPath();
                    context.arc(x, y, 3, 0, 2 * Math.PI);
                    context.fill();
                };
                drawEye(head.x - 5, head.y - 5);
                drawEye(head.x + 5, head.y - 5);

                // 绘制鼻子
                // context.beginPath();
                // context.arc(head.x, head.y + 5, 3, 0, 2 * Math.PI);
                // context.fill();
            }

        };

        const render = () => {

            context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
            players.forEach(player => {
                drawMouse(player);
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
            className="Mouse"
        ></canvas>
    );
};

export default Mouse;
