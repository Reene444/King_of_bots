function renderScene() {
    // 计算相机的偏移量，使玩家保持在画布中心
    const offsetX = canvasCenterX - (player.x + player.width / 2);
    const offsetY = canvasCenterY - (player.y + player.height / 2);

    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 平移画布，使玩家保持在画布中心
    context.save();
    context.translate(offsetX, offsetY);

    // 渲染背景
    renderBackground(context);

    // 渲染其他游戏元素，如敌人、障碍物等
    renderEnemies(context);

    // 渲染玩家
    player.render(context);

    // 恢复画布状态
    context.restore();
}

function renderBackground(ctx) {
    // 假设背景为 2000x2000 的世界
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, 2000, 2000);
}

function renderEnemies(ctx) {
    // 示例：绘制敌人或其他物体
    ctx.fillStyle = 'red';
    ctx.fillRect(500, 500, 100, 100); // 画一个敌人
}
