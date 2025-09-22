document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有需要的 HTML 元素
    const nameListTextarea = document.getElementById('nameList');
    const quickAddCountInput = document.getElementById('quickAddCount');
    const quickAddBtn = document.getElementById('quickAddBtn');
    const drawBtn = document.getElementById('drawBtn');
    const resetBtn = document.getElementById('resetBtn');
    const winnerNameDisplay = document.getElementById('winnerName');
    const currentListUl = document.getElementById('currentList');
    const removedListUl = document.getElementById('removedList'); // 新增：已移除名單的 ul

    let originalParticipants = []; // 儲存原始名單的陣列
    let participants = []; // 儲存所有參與者的陣列
    let removedParticipants = []; // 新增：儲存被移除名單的陣列

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
        updateRemovedListDisplay(); // 在更新目前名單時，也更新已移除名單
    };

    // 新增：負責更新已移除名單顯示的函式
    const updateRemovedListDisplay = () => {
        removedListUl.innerHTML = '';
        if (removedParticipants.length === 0) {
            removedListUl.innerHTML = '<li>無</li>';
        } else {
            removedListUl.innerHTML = '';
            removedParticipants.forEach((name, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${name}</span>
                    <button class="restore-btn" data-index="${index}">&#x27F2;</button>
                `;
                removedListUl.appendChild(li);
            });
        }
    };

    // 處理手動輸入人名或貼上名單的事件
    nameListTextarea.addEventListener('input', () => {
        participants = nameListTextarea.value.split('\n').filter(name => name.trim() !== '');
        originalParticipants = [...participants];
        removedParticipants = []; // 新增：重設時清空移除名單
        updateCurrentListDisplay();
    });

    // 處理快速新增編號的事件
    quickAddBtn.addEventListener('click', () => {
        const count = parseInt(quickAddCountInput.value);
        if (count > 0) {
            participants = [];
            for (let i = 1; i <= count; i++) {
                participants.push(`編號 ${i}`);
            }
            originalParticipants = [...participants];
            removedParticipants = []; // 新增：重設時清空移除名單
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

        const duration = 2500; // 動畫總時長（毫秒）
        let startTime = Date.now();
        
        // 禁用所有功能按鈕，避免重複操作
        drawBtn.disabled = true;
        resetBtn.disabled = true;
        quickAddBtn.disabled = true;

        function animate() {
            const elapsedTime = Date.now() - startTime;
            
            // 隨機選取一個人名來顯示
            const randomIndex = Math.floor(Math.random() * participants.length);
            winnerNameDisplay.textContent = participants[randomIndex];
            
            // 如果動畫時間還沒到，繼續執行
            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            } else {
                // 動畫結束，選出最終贏家
                const finalIndex = Math.floor(Math.random() * participants.length);
                const winner = participants[finalIndex];
                
                // 顯示最終贏家
                winnerNameDisplay.textContent = winner;
                
                // 將贏家從目前名單移除，並加入已移除名單
                participants.splice(finalIndex, 1);
                removedParticipants.push(winner);
                
                // 重新啟用所有功能按鈕
                drawBtn.disabled = false;
                resetBtn.disabled = false;
                quickAddBtn.disabled = false;

                // 更新名單顯示
                updateCurrentListDisplay();
            }
        }
        
        // 開始動畫
        animate();
    });

    // 處理重置按鈕的點擊事件
    resetBtn.addEventListener('click', () => {
        if (originalParticipants.length === 0) {
            alert('目前沒有已備份的名單可供恢復！');
            return;
        }
        
        // 恢復名單並清空已移除名單
        participants = [...originalParticipants];
        removedParticipants = [];
        
        winnerNameDisplay.textContent = '等待抽籤...';
        updateCurrentListDisplay();
        alert('名單已恢復，可以重新開始抽籤！');
    });

    // 新增：處理恢復按鈕的點擊事件
    removedListUl.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('restore-btn')) {
            const index = target.dataset.index;
            const nameToRestore = removedParticipants.splice(index, 1)[0];
            
            // 將人名加回目前名單
            participants.push(nameToRestore);
            
            // 更新顯示
            updateCurrentListDisplay();
            alert(`${nameToRestore} 已恢復到名單中！`);
        }
    });

    // 初次載入時更新名單顯示
    updateCurrentListDisplay();
});
