import React, { useRef, useEffect } from 'react';
import './Snake.css';

const Snake = ({ players, onMouseMove }) => {
    const canvasRef = useRef(null);
    const snakePositions = useRef(new Map()); // 使用 useRef 来存储蛇的位置

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const drawSnake = (player) => {
            if (!player.segments || player.segments.length === 0) return; // 防止未定义的属性访问

            context.fillStyle = player.color;
            context.strokeStyle = player.color;
            context.lineWidth = 20;

            // 设置阴影属性
            context.shadowBlur = 10;
            context.shadowColor = 'rgba(0, 0, 0, 0.1)';
            context.lineJoin = 'round';  // 设置线条连接样式为圆角
            context.lineCap = 'round';   // 设置线条端点样式为圆角

            if (!snakePositions.current.has(player.id)) {
                // 初次绘制时，绘制整个蛇
                console.log("update from null");
                context.beginPath();
                context.moveTo(player.segments[0].x, player.segments[0].y);
                for (let i = 1; i < player.segments.length; i++) {
                    const segment = player.segments[i];
                    if (segment) {
                        context.lineTo(segment.x, segment.y);
                    }
                }
                context.stroke();

                // 更新上次绘制的头尾
                snakePositions.current.set(player.id, {
                    previousHead: { ...player.segments[0] },
                    previousTail: { ...player.segments[player.segments.length - 1] }
                });

                context.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                // 获取上次绘制的头尾信息
                const { previousHead, previousTail } = snakePositions.current.get(player.id);
                 console.log("jst update from last storage");
                // 清除之前的尾巴
                context.clearRect(previousTail.x - 10, previousTail.y - 10, 20, 20); // 调整清除区域大小以覆盖尾巴

                // 绘制新增的头部
                const newHead = player.segments[0];
                context.beginPath();
                context.moveTo(previousHead.x, previousHead.y);
                context.lineTo(newHead.x, newHead.y);
                context.stroke();

                // 更新上次绘制的头尾
                snakePositions.current.set(player.id, {
                    previousHead: { ...newHead },
                    previousTail: { ...player.segments[player.segments.length - 1] }
                });
            }

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

                // 重置阴影属性
                context.shadowBlur = 0.4;
                context.shadowColor = 'transparent';

                // 绘制玩家昵称
                context.fillStyle = player.color;
                context.font = '12px Arial';
                context.textAlign = 'center';
                context.fillText(player.nickname, head.x, head.y - 30); // 在头部上方绘制昵称
            }


        };

        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height); // 在绘制前清空画布
            players.forEach(player => {
                drawSnake(player);
            });
        };
        requestAnimationFrame(render)
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
