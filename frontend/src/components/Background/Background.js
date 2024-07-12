import React, { useEffect } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const Background = () => {
    useEffect(() => {
        const scene = new THREE.Scene();
        const backgroundColor = 0xf0f0f0;
        scene.background = new THREE.Color(backgroundColor);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100vw';
        renderer.domElement.style.height = '100vh';
        renderer.domElement.style.zIndex = '-1'; // 确保 canvas 在背景

        document.body.appendChild(renderer.domElement);

        // 创建蛇的身体部分
        const segmentCount = 50; // 增加段数
        const segmentLength = 0.3; // 缩短段长
        const snakeSegments = [];

        for (let i = 0; i < segmentCount; i++) {
            const segmentGeometry = new THREE.SphereGeometry(segmentLength / 2, 32 , 32);
            const segmentMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.x = -i * segmentLength *0.000000001;
            segment.position.y = -i * segmentLength *0.000000001;
            snakeSegments.push(segment);
            scene.add(segment);
        }

        // 添加眼睛
        const addEyes = (head) => {
            const eyeGeometry = new THREE.SphereGeometry(0.06, 32, 32);
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);

            leftEye.position.set(0.1, 0.1, 0.1);
            rightEye.position.set(0.1, 0.1, -0.1);

            head.add(leftEye);
            head.add(rightEye);
        };
        addEyes(snakeSegments[snakeSegments.length-1]);

        camera.position.z = 10;

        const noise2D = createNoise2D();
        let progress = 0;

        const noiseScale = 0.01; // 调整噪声尺度
        const speed = 0.002; // 降低速度

        // 定义路径生成函数
        const pathFunction = (t) => {
            const x = noise2D(t * noiseScale, 0) * 15;
            const y = noise2D(0, t * noiseScale) * 8;
            return new THREE.Vector3(x, y, 0);
        };

        const points = [];
        for (let i = 0; i < 30000; i++) { // 增加路径点数量
            points.push(pathFunction(i));
        }

        const curve = new THREE.CatmullRomCurve3(points);

        const animate = () => {
            requestAnimationFrame(animate);

            progress += speed;

            const path = curve.getPoints(80000); // 增加路径点数量
            for (let i = 0; i < snakeSegments.length; i++) {
                const segment = snakeSegments[i];
                const index = (Math.floor(progress * 1100) + i) % path.length;
                const position = path[index];
                if (position) {
                    segment.position.x = position.x;
                    segment.position.y = position.y;

                    if (i > 0) {
                        const prevSegment = snakeSegments[i - 1];
                        segment.lookAt(prevSegment.position);
                    }
                }
            }

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return null;
};

export default Background;
