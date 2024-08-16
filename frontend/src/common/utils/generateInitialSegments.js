export const  generateInitialSegments = (players) => {
    let segments;
    let isSafe;
    do {
        const startX = Math.floor(Math.random() * window.innerWidth);
        const startY = Math.floor(Math.random() * window.innerHeight);
        segments = Array.from({ length: 15 }, (_, index) => ({ x: startX - index * 1 , y: startY }));
        isSafe = players && players.every(player =>
                player && Array.isArray(player.segments) && player.segments.every(segment =>
                    segments.every(s => segment && Math.abs(segment.x - s.x) >= 20 && Math.abs(segment.y - s.y) >= 20)
                )
        );
        // alert("genrate new")
    } while (!isSafe);
    return segments;
};
