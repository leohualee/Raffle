document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有需要的 HTML 元素
    const nameListTextarea = document.getElementById('nameList');
    const quickAddCountInput = document.getElementById('quickAddCount');
    const quickAddBtn = document.getElementById('quickAddBtn');
    const drawBtn = document.getElementById('drawBtn');
    const resetBtn = document.getElementById('resetBtn');
    const winnerNameDisplay = document.getElementById('winnerName');
    const currentListUl = document.getElementById('currentList');

    let originalParticipants = []; // 儲存原始名單的陣列
    let participants = []; // 儲存所有參與者的陣列

    // 負責更新目前名單顯示的函式
    const updateCurrentListDisplay = () => {
        currentListUl.innerHTML = ''; // 清空舊名單
        if (participants.length === 0) {
            currentListUl.innerHTML = '<li>名單為空</li>';
            drawBtn.disabled = true; // 名單為空時禁用抽籤按鈕
        } else {
            drawBtn.disabled = false;
            participants.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                currentListUl.appendChild(li);
            });
        }
    };

    // 處理手動輸入人名或貼上名單的事件
    nameListTextarea.addEventListener('input', () => {
        // 將文字框的內容拆成陣列，並過濾掉空行
        participants = nameListTextarea.value.split('\n').filter(name => name.trim() !== '');
        
        // 將目前名單複製一份給原始名單
        originalParticipants = [...participants];

        updateCurrentListDisplay();
    });

    // 處理快速新增編號的事件
    quickAddBtn.addEventListener('click', () => {
        const count = parseInt(quickAddCountInput.value);
        if (count > 0) {
            participants = []; // 清空舊名單
            for (let i = 1; i <= count; i++) {
                participants.push(`編號 ${i}`);
            }
            // 將目前名單複製一份給原始名單
            originalParticipants = [...participants];
            
            // 更新文字框內容
            nameListTextarea.value = participants.join('\n');
            updateCurrentListDisplay();
        } else {
            alert('請輸入一個大於 0 的數字');
        }
    });

    // 處理抽籤按鈕的點擊事件
    drawBtn.addEventListener('click', () => {
        if (participants.length === 0) {
            alert('目前名單為空，請先輸入人名或新增人數！');
            return;
        }

        // 隨機選擇一個索引
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];
        
        // 顯示抽籤結果
        winnerNameDisplay.textContent = winner;
        
        // 暫時將抽到的人從名單中移除
        participants.splice(randomIndex, 1);
        
        // 更新顯示
        updateCurrentListDisplay();
    });

    // 處理重置按鈕的點擊事件
    resetBtn.addEventListener('click', () => {
        // 將目前名單恢復成原始名單
        participants = [...originalParticipants];
        
        winnerNameDisplay.textContent = '等待抽籤...'; // 重設結果顯示
        updateCurrentListDisplay(); // 更新名單顯示
        alert('名單已恢復，可以重新開始抽籤！');
    });

    // 初次載入時更新名單顯示
    updateCurrentListDisplay();
});