document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // 初始化狗和蜜蜂的位置
    let dogPosition = { x: 50, y: 50 };
    let bees = []; // 存儲所有蜜蜂的陣列
    let linePosition = null;
    let score = 0; // 分數

    // 創建30個蜜蜂
    for (let i = 0; i < 30; i++) {
        bees.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            velocityX: randomSpeed(),
            velocityY: randomSpeed()
        });
    }

    function randomSpeed() {
        return Math.random() * 4 - 2;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新所有蜜蜂的位置
        for (let i = 0; i < bees.length; i++) {
            const bee = bees[i];
            bee.x += bee.velocityX;
            bee.y += bee.velocityY;

            // 碰到邊界就反彈
            if (bee.x <= 0 || bee.x >= canvas.width) {
                bee.velocityX = -bee.velocityX;
            }
            if (bee.y <= 0 || bee.y >= canvas.height) {
                bee.velocityY = -bee.velocityY;
            }

            // 碰到線就消失並重生，並得一分
            if (linePosition) {
                const distance = Math.sqrt(Math.pow(bee.x - linePosition.x, 2) + Math.pow(bee.y - linePosition.y, 2));
                if (distance <= 5) {
                    // 從陣列中刪除蜜蜂
                    bees.splice(i, 1);

                    // 增加分數
                    score += 1;

                    // 創建一個新的蜜蜂，位置在右上角
                    bees.push({
                        x: canvas.width,
                        y: 0,
                        velocityX: randomSpeed(),
                        velocityY: randomSpeed()
                    });
                }
            }

            // 如果蜜蜂碰到狗，扣一分
            const distanceToDog = Math.sqrt(Math.pow(bee.x - dogPosition.x, 2) + Math.pow(bee.y - dogPosition.y, 2));
            if (distanceToDog <= 30) {
                score -= 1;
                // 可以根據需要添加其他處理碰撞的邏輯
            }

            // 畫蜜蜂
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(bee.x, bee.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // 畫狗
        ctx.fillStyle = "brown";
        ctx.fillRect(dogPosition.x, dogPosition.y, 50, 50);

        // 畫線
        if (linePosition !== null) {
            ctx.beginPath();
            ctx.moveTo(dogPosition.x + 25, dogPosition.y + 25);
            ctx.lineTo(linePosition.x, linePosition.y);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 5;
            ctx.stroke();
        }

        // 顯示分數
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    let isDrawing = false;
    canvas.addEventListener("mousedown", function(event) {
        isDrawing = true;
    });
    canvas.addEventListener("mousemove", function(event) {
        if (isDrawing) {
            linePosition = { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
        }
    });
    canvas.addEventListener("mouseup", function(event) {
        isDrawing = false;
        linePosition = null;
    });

    function gameLoop() {
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
