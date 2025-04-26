// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const assistantYes = document.getElementById('assistant-yes');
    const assistantNo = document.getElementById('assistant-no');
    const assistantMessage = document.getElementById('assistant-message');
    const assistantAvatar = document.getElementById('assistant-avatar');
    const collapsibles = document.querySelectorAll('.collapsible');
    const strategyFlowchart = document.getElementById('strategy-flowchart');
    const scheduleDropzone = document.getElementById('schedule-dropzone');
    const vsScheduleDropzone = document.getElementById('vs-schedule-dropzone');
    const calendarGrid = document.getElementById('calendar-grid');
    const criticalTasks = document.getElementById('critical-tasks');
    const totalPoints = document.getElementById('total-points');
    const pointsProgress = document.getElementById('points-progress');
    const rewardTier = document.getElementById('reward-tier');
  
    // Initialize the app
    initTabs();
    initAssistant();
    initCollapsibles();
    initDragAndDrop();
    initFlowchart();
    generateCalendar();
    populateCriticalTasks();
});

// Tab Navigation
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
          
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
          
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Assistant Interaction
function initAssistant() {
    const assistantYes = document.getElementById('assistant-yes');
    const assistantNo = document.getElementById('assistant-no');
    const assistantMessage = document.getElementById('assistant-message');
    const assistantAvatar = document.getElementById('assistant-avatar');
  
    assistantYes.addEventListener('click', () => {
        assistantMessage.textContent = "Great! Let's start by checking what events are coming up. I see the Arms Race event is starting tomorrow with the Purchase theme. Let me help you plan for that.";
      
        setTimeout(() => {
            showToast('Assistant is creating your personalized plan...', 'info');
          
            setTimeout(() => {
                // Switch to Arms Race tab
                const tabButtons = document.querySelectorAll('.tab-btn');
                const tabContents = document.querySelectorAll('.tab-content');
              
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
              
                document.querySelector('[data-tab="arms-race"]').classList.add('active');
                document.getElementById('arms-race').classList.add('active');
              
                // Open the event schedule section
                const scheduleCollapsible = document.querySelector('#arms-race .collapsible');
                scheduleCollapsible.classList.add('active');
                const content = scheduleCollapsible.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
              
                showToast('Check out the Purchase theme activities to maximize your points!', 'success');
            }, 1500);
        }, 1000);
    });
  
    assistantNo.addEventListener('click', () => {
        assistantMessage.textContent = "No problem! I'm here whenever you need assistance with event planning. Just click on me if you change your mind.";
        assistantYes.parentElement.style.display = 'none';
    });
  
    assistantAvatar.addEventListener('click', () => {
        if (assistantYes.parentElement.style.display === 'none') {
            assistantYes.parentElement.style.display = 'flex';
            assistantMessage.textContent = "Would you like me to help plan your event participation?";
        }
    });
}

// Collapsible Sections
function initCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');
  
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Drag and Drop Functionality
function initDragAndDrop() {
    const draggables = document.querySelectorAll('[draggable="true"]');
    const scheduleDropzone = document.getElementById('schedule-dropzone');
    const vsScheduleDropzone = document.getElementById('vs-schedule-dropzone');
  
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
      
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });
  
    if (scheduleDropzone) {
        scheduleDropzone.addEventListener('dragover', e => {
            e.preventDefault();
            scheduleDropzone.classList.add('highlight');
        });
      
        scheduleDropzone.addEventListener('dragleave', () => {
            scheduleDropzone.classList.remove('highlight');
        });
      
        scheduleDropzone.addEventListener('drop', e => {
            e.preventDefault();
            scheduleDropzone.classList.remove('highlight');
          
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                const clone = dragging.cloneNode(true);
                scheduleDropzone.innerHTML = '';
                scheduleDropzone.appendChild(clone);
              
                // Update points projection
                const points = parseInt(dragging.dataset.points || 0);
                const totalPoints = document.getElementById('total-points');
                if (totalPoints) {
                    totalPoints.textContent = points;
                    updatePointsProgress(points);
                }
              
                showToast('Task added to your schedule!', 'success');
            }
        });
    }
  
    if (vsScheduleDropzone) {
        vsScheduleDropzone.addEventListener('dragover', e => {
            e.preventDefault();
            vsScheduleDropzone.classList.add('highlight');
        });
      
        vsScheduleDropzone.addEventListener('dragleave', () => {
            vsScheduleDropzone.classList.remove('highlight');
        });
      
        vsScheduleDropzone.addEventListener('drop', e => {
            e.preventDefault();
            vsScheduleDropzone.classList.remove('highlight');
          
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                const clone = dragging.cloneNode(true);
                vsScheduleDropzone.innerHTML = '';
                vsScheduleDropzone.appendChild(clone);
              
                showToast('VS Event task added to your schedule!', 'success');
            }
        });
    }
}

// Interactive Flowchart
function initFlowchart() {
    const strategyFlowchart = document.getElementById('strategy-flowchart');
  
    if (strategyFlowchart) {
        // Create example nodes
        createNode('Start Planning', 50, 50);
        createNode('Gather Resources', 200, 100);
        createNode('Arms Race Tasks', 350, 50);
        createNode('VS Event Tasks', 350, 150);
        createNode('Complete Daily Tasks', 500, 100);
      
        // Connect nodes with lines
        connectNodes();
    }
}

function createNode(text, x, y) {
    const strategyFlowchart = document.getElementById('strategy-flowchart');
  
    if (!strategyFlowchart) return null;
  
    const node = document.createElement('div');
    node.className = 'node';
    node.textContent = text;
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    node.setAttribute('data-x', x);
    node.setAttribute('data-y', y);
  
    // Make node draggable
    node.addEventListener('mousedown', startDrag);
  
    strategyFlowchart.appendChild(node);
    return node;
}

function startDrag(e) {
    const node = e.target;
  
    // Set initial positions
    let startX = e.clientX;
    let startY = e.clientY;
  
    // Node's initial position
    let nodeX = parseInt(node.style.left);
    let nodeY = parseInt(node.style.top);
  
    node.classList.add('dragging');
  
    // Mouse move handler for dragging
    function dragMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
      
        node.style.left = (nodeX + dx) + 'px';
        node.style.top = (nodeY + dy) + 'px';
      
        // Update node data attributes
        node.setAttribute('data-x', nodeX + dx);
        node.setAttribute('data-y', nodeY + dy);
      
        // Redraw connections
        connectNodes();
    }
  
    // Mouse up handler to stop dragging
    function dragEnd() {
        node.classList.remove('dragging');
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
      
        // Show toast when node is moved
        showToast('Strategy flowchart updated!', 'success');
    }
  
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
  
    e.preventDefault(); // Prevent text selection during drag
}

function connectNodes() {
    const strategyFlowchart = document.getElementById('strategy-flowchart');
  
    if (!strategyFlowchart) return;
  
    // Remove existing connections
    document.querySelectorAll('.connection').forEach(conn => conn.remove());
  
    // Define connections (simple sequential flow for this example)
    const nodes = document.querySelectorAll('.node');
  
    for (let i = 0; i < nodes.length - 1; i++) {
        drawConnection(nodes[i], nodes[i + 1]);
    }
}

function drawConnection(node1, node2) {
    const strategyFlowchart = document.getElementById('strategy-flowchart');
  
    if (!strategyFlowchart) return;
  
    // Get node centers
    const x1 = parseInt(node1.getAttribute('data-x')) + node1.offsetWidth / 2;
    const y1 = parseInt(node1.getAttribute('data-y')) + node1.offsetHeight / 2;
    const x2 = parseInt(node2.getAttribute('data-x')) + node2.offsetWidth / 2;
    const y2 = parseInt(node2.getAttribute('data-y')) + node2.offsetHeight / 2;
  
    // Create SVG line
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "connection");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
  
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#3498db");
    line.setAttribute("stroke-width", "2");
  
    svg.appendChild(line);
    strategyFlowchart.appendChild(svg);
}

// Calendar Generation
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
  
    if (!calendarGrid) return;
  
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
  
    const calendarMonth = document.getElementById('calendar-month');
    if (calendarMonth) {
        calendarMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  
    // Clear grid
    calendarGrid.innerHTML = '';
  
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.textContent = day;
        dayEl.style.fontWeight = 'bold';
        dayEl.style.padding = '10px';
        dayEl.style.textAlign = 'center';
        calendarGrid.appendChild(dayEl);
    });
  
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    // Add empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        emptyDay.style.opacity = '0.3';
        calendarGrid.appendChild(emptyDay);
    }
  
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = i;
      
        // Mark current day
        if (i === currentDate.getDate()) {
            dayEl.style.backgroundColor = '#3498db20';
            dayEl.style.borderColor = '#3498db';
            dayEl.style.fontWeight = 'bold';
        }
      
        // Add event indicators for some example days
        if (i === 27 || i === 29) {
            dayEl.classList.add('has-event');
          
            // Create event popup
            const popup = document.createElement('div');
            popup.className = 'event-popup';
            popup.innerHTML = i === 27 ? 
                '<strong>Arms Race: Purchase Theme</strong><p>04:00 - All Day</p>' : 
                '<strong>VS Event: Battle Phase</strong><p>04:00 - All Day</p>';
          
            dayEl.appendChild(popup);
          
            // Show/hide popup on click
            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('active');
                });
                dayEl.classList.add('active');
            });
        }
      
        calendarGrid.appendChild(dayEl);
    }
}

// Critical Tasks Population
function populateCriticalTasks() {
    const criticalTasks = document.getElementById('critical-tasks');
  
    if (!criticalTasks) return;
  
    const tasks = [
        {
            title: 'Save Diamonds',
            icon: 'fas fa-gem',
            description: 'Save your diamonds for the Purchase theme tomorrow to maximize Arms Race points.',
            time: 'Today',
            color: 'var(--warning)'
        },
        {
            title: 'Elite Recruitment',
            icon: 'fas fa-user-plus',
            description: 'Prepare for Recruit theme by saving recruitment tickets.',
            time: 'By Apr 28',
            color: 'var(--secondary)'
        },
        {
            title: 'Alliance Coordination',
            icon: 'fas fa-users',
            description: 'Join alliance planning meeting for VS Event strategy.',
            time: 'Today at 20:00',
            color: 'var(--accent)'
        }
    ];
  
    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    <div class="task-icon" style="background-color: ${task.color}"><i class="${task.icon}"></i></div>
                    ${task.title}
                </div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-time"><i class="far fa-clock"></i> ${task.time}</div>
            <div class="task-actions">
                <button class="task-btn" onclick="completeTask(this.parentNode.parentNode)">Complete</button>
                <button class="task-btn secondary" onclick="openReminderModal('${task.title}')">Remind Me</button>
            </div>
        `;
      
        criticalTasks.appendChild(taskCard);
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
  
    if (!toastContainer) return;
  
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
  
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'error') icon = 'fas fa-times-circle';
  
    toast.innerHTML = `
        <div class="toast-icon"><i class="${icon}"></i></div>
        <div>${message}</div>
    `;
  
    toastContainer.appendChild(toast);
  
    // Remove toast after animation completes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Modal functions
function openReminderModal(taskTitle) {
    const reminderModal = document.getElementById('reminder-modal');
    if (reminderModal) {
        reminderModal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveReminder() {
    const reminderTime = document.getElementById('reminder-time');
    const notificationType = document.getElementById('notification-type');
  
    if (reminderTime && notificationType) {
        showToast('Reminder set successfully!', 'success');
        closeModal('reminder-modal');
    }
}

// Task Management
function addToSchedule(taskCard) {
    const scheduleDropzone = document.getElementById('schedule-dropzone');
    const totalPoints = document.getElementById('total-points');
  
    if (!scheduleDropzone || !totalPoints) return;
  
    const clone = taskCard.cloneNode(true);
    scheduleDropzone.innerHTML = '';
    scheduleDropzone.appendChild(clone);
  
    // Update points projection
    const points = parseInt(taskCard.dataset.points || 0);
    totalPoints.textContent = points;
    updatePointsProgress(points);
  
    showToast('Task added to your schedule!', 'success');
}

function addToVsSchedule(taskCard) {
    const vsScheduleDropzone = document.getElementById('vs-schedule-dropzone');
  
    if (!vsScheduleDropzone) return;
  
    const clone = taskCard.cloneNode(true);
    vsScheduleDropzone.innerHTML = '';
    vsScheduleDropzone.appendChild(clone);
  
    showToast('VS Event task added to your schedule!', 'success');
}

function completeTask(taskCard) {
    // Add complete class to task
    taskCard.classList.add('completed');
  
    // Update complete button
    const completeBtn = taskCard.querySelector('.task-btn');
    if (completeBtn) {
        completeBtn.textContent = 'Completed';
        completeBtn.classList.add('complete');
        completeBtn.disabled = true;
    }
  
    showToast('Task completed! Great job!', 'success');
}

function updatePointsProgress(points) {
    const pointsProgress = document.getElementById('points-progress');
    const rewardTier = document.getElementById('reward-tier');
  
    if (!pointsProgress || !rewardTier) return;
  
    // Calculate percentage (assume 5000 points is max)
    const percentage = Math.min(100, (points / 5000) * 100);
    pointsProgress.style.width = percentage + '%';
  
    // Update reward tier
    if (points < 1000) {
        rewardTier.textContent = 'Bronze';
    } else if (points < 3000) {
        rewardTier.textContent = 'Silver';
    } else if (points < 5000) {
        rewardTier.textContent = 'Gold';
    } else {
        rewardTier.textContent = 'Platinum';
    }
}

// Alliance Tools Functions
function generateAnnouncement() {
    const announcementType = document.getElementById('announcement-type');
    const announcementDetails = document.getElementById('announcement-details');
    const announcementText = document.getElementById('announcement-text');
    const generatedAnnouncement = document.getElementById('generated-announcement');
  
    if (!announcementType || !announcementDetails || !announcementText || !generatedAnnouncement) return;
  
    const type = announcementType.value;
    const details = announcementDetails.value;
  
    let announcement = '';
  
    switch (type) {
        case 'event':
            announcement = `<h3>Event Announcement</h3>
                <p>📢 <strong>ALLIANCE NOTICE:</strong> Upcoming event participation required!</p>
                <p>${details || 'Arms Race event is starting tomorrow. All members are expected to participate and contribute to alliance goals. Purchase theme will be active first - save your diamonds!'}</p>
                <p>⏰ Event starts: April 27th, 04:00</p>
                <p>🎯 Alliance goal: Top 3 placement</p>
                <p>💪 Together we can win this! Check the Event Planner app for detailed strategies.</p>`;
            break;
        case 'strategy':
            announcement = `<h3>Strategy Coordination</h3>
                <p>📊 <strong>ALLIANCE STRATEGY:</strong> Arms Race optimization plan</p>
                <p>${details || 'To maximize our alliance performance, please follow these guidelines:'}</p>
                <ul style="list-style-type: none; padding-left: 5px;">
                    <li>• Save resources for appropriate theme days</li>
                    <li>• Coordinate large point activities with R4/R5</li>
                    <li>• Daily minimum contribution: 300 points</li>
                    <li>• Use Event Planner app for personalized guidance</li>
                </ul>
                <p>🔄 Strategy updates will be posted daily. Stay tuned!</p>`;
            break;
        case 'requirements':
            announcement = `<h3>Participation Requirements</h3>
                <p>⚠️ <strong>ALLIANCE REQUIREMENTS:</strong> Minimum participation standards</p>
                <p>${details || 'To maintain your position in the alliance, the following minimum requirements must be met:'}</p>
                <ul style="list-style-type: none; padding-left: 5px;">
                    <li>• Arms Race: 2,000 points minimum</li>
                    <li>• VS Event: Active participation in at least 3 battles</li>
                    <li>• Daily activity: Check-in and resource assistance</li>
                    <li>• Communication: Respond to alliance messages</li>
                </ul>
                <p>📱 Use the Event Planner app to track your progress and ensure you meet these requirements.</p>`;
            break;
        case 'rewards':
            announcement = `<h3>Rewards Distribution</h3>
                <p>🏆 <strong>ALLIANCE REWARDS:</strong> Event rewards distribution</p>
                <p>${details || 'Alliance rewards will be distributed based on the following criteria:'}</p>
                <ul style="list-style-type: none; padding-left: 5px;">
                    <li>• Top contributors (5,000+ points): Premium rewards</li>
                    <li>• Active participants (2,000+ points): Standard rewards</li>
                    <li>• Basic participants (500+ points): Basic rewards</li>
                </ul>
                <p>💯 Individual performance will be tracked through the Event Planner app. Make sure to log all your activities!</p>`;
            break;
    }
  
    announcementText.innerHTML = announcement;
    generatedAnnouncement.style.display = 'block';
  
    showToast('Announcement generated successfully!', 'success');
}

function copyAnnouncement() {
    const announcementText = document.getElementById('announcement-text');
  
    if (!announcementText) return;
  
    // Create a temporary textarea to copy from
    const textarea = document.createElement('textarea');
    textarea.value = announcementText.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  
    showToast('Announcement copied to clipboard!', 'success');
}

function generateStrategy() {
    showToast('Strategy document generated and ready to share!', 'success');
}

function sendReminder(button) {
    const row = button.closest('tr');
    if (!row) return;
  
    const memberName = row.querySelector('td:first-child').textContent;
  
    showToast(`Reminder sent to ${memberName}`, 'success');
}

function addToCalendar(button) {
    const taskCard = button.closest('.task-card');
    if (!taskCard) return;
  
    const title = taskCard.querySelector('.task-title').textContent.trim();
    const time = taskCard.querySelector('.task-time').textContent.trim();
  
    showToast(`${title} added to your calendar at ${time}`, 'success');
}

function setReminder(button) {
    const taskCard = button.closest('.task-card');
    if (!taskCard) return;
  
    const title = taskCard.querySelector('.task-title').textContent.trim();
  
    openReminderModal(title);
}