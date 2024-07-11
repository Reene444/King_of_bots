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

                const bodyCenterX =bodyStart.x + (bodyEnd.x - bodyStart.x) / 3;
                const bodyCenterY = bodyStart.y+(bodyEnd.y - bodyStart.y) / 3;
                let bodyWidth =Math.max(Math.abs(bodyStart.x - bodyEnd.x) + 10,15);
                let bodyHeight = Math.max(Math.abs(bodyStart.y - bodyEnd.y) + 10,15);

                bodyHeight=Math.max(bodyHeight,bodyWidth)
                bodyWidth=Math.min(bodyWidth,bodyHeight)
                const dx = bodyEnd.x - bodyStart.x;
                const dy = bodyEnd.y - bodyStart.y;
                const angle = Math.atan2(dx, dy);
                // correct the angle for the start
                const correctedAngle = angle >90 ? angle + Math.PI : angle;
                context.beginPath();
                context.ellipse(bodyCenterX - bodyStart.x+head.x , bodyCenterY - bodyStart.y + head.y, bodyWidth / 4   , bodyHeight / 6  , 0 , correctedAngle,correctedAngle+ 2 * Math.PI);

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
                drawLimb(bodyStart.x - 10, bodyStart.y + 15, 2, 10);
                drawLimb(bodyStart.x + 10, bodyStart.y + 15, 2, 10);
                drawLimb(bodyStart.x + (bodyEnd.x - bodyStart.x) / 3 -8, bodyStart.y+(bodyEnd.y - bodyStart.y) / 3 +10, 2, 10);
                drawLimb(bodyStart.x + (bodyEnd.x - bodyStart.x) / 3+ 8, bodyStart.y+(bodyEnd.y - bodyStart.y) / 3 +10 , 2, 10);
            }

            // 绘制尾巴
            if (bodyEnd) {
                context.strokeStyle = player.color;
                context.beginPath();
                context.moveTo(bodyStart.x + (bodyEnd.x - bodyStart.x) / 3 -8, bodyStart.y+(bodyEnd.y - bodyStart.y) / 3 );

                const ax_x=bodyStart.x + (bodyEnd.x - bodyStart.x) / 3 -8;
                const ax_y=bodyStart.y+(bodyEnd.y - bodyStart.y) / 3;
                const dx=bodyEnd.x-bodyStart.x;
                const dy=bodyEnd.y-bodyStart.y
                context.bezierCurveTo(ax_x+0.1*dx ,ax_y-0.1*dy , ax_x+ 0.4*dx, ax_y+0.1*dy , ax_x + 0.5*dx, ax_y -10);
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
                    context.arc(x, y, 15, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                };
                drawEar(head.x - 15, head.y - 10);
                drawEar(head.x + 15, head.y - 10);

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

                // 绘制玩家昵称
                context.fillStyle = player.color;
                context.font = '12px Arial';
                context.textAlign = 'center';
                context.fillText(player.nickname, head.x, head.y - 35); // 在头部上方绘制昵称
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
