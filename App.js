let currentType = 'lifting';

function switchTab(type) {
    currentType = type;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('liftingFields').style.display = type === 'lifting' ? 'block' : 'none';
    document.getElementById('cardioFields').style.display = type === 'cardio' ? 'block' : 'none';
}

document.getElementById('trackerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let record = { type: currentType, date: new Date().toLocaleDateString('en-GB') };
    let cals = 0;

    if (currentType === 'lifting') {
        const name = document.getElementById('exerciseName').value;
        const sets = document.getElementById('sets').value;
        const weight = document.getElementById('weight').value;
        if (!name || !sets || !weight) return alert('عبي كل الخانات للحديد!');
        
        cals = Math.round((sets * 15) + (weight * 0.2)); 
        record.text = `حديد: ${name} | ${sets} جلسات | ${weight} كج`;
    } else {
        const name = document.getElementById('cardioName').value;
        const mins = document.getElementById('minutes').value;
        if (!name || !mins) return alert('عبي كل الخانات للكارديو!');
        
        cals = Math.round(mins * 10); 
        record.text = `كارديو: ${name} | ${mins} دقيقة`;
    }

    record.cals = cals;
    saveRecord(record);
    this.reset();
});

function saveRecord(record) {
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    history.push(record);
    localStorage.setItem('workoutHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    
    const today = new Date().toLocaleDateString('en-GB');
    const todayHistory = history.filter(item => item.date === today);

    todayHistory.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = `${item.text} <br><span class="cals">🔥 حرقت تقريباً: ${item.cals} سعرة</span>`;
        list.appendChild(li);
    });
}

window.onload = loadHistory;
