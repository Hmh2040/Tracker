// قائمة شاملة لكل تمارينك المعتمدة مع عدد جلساتها الافتراضية
const allExercises = [
    // الجزء العلوي والأكتاف والظهر
    { name: "Barbell Strict Overhead Press", sets: 4, category: "Upper/Shoulders" },
    { name: "Pull-ups (سحب واسع)", sets: 3, category: "Back" },
    { name: "Weighted Pull-ups", sets: 4, category: "Back" },
    { name: "Incline Dumbbell Bench Press", sets: 3, category: "Chest" },
    { name: "Barbell Pendlay Rows", sets: 3, category: "Back" },
    { name: "Dumbbell Lateral Raises", sets: 3, category: "Shoulders" },
    { name: "Barbell Shrugs", sets: 3, category: "Traps" },
    { name: "Dips", sets: 3, category: "Chest/Triceps" },
    { name: "Weighted Dips", sets: 3, category: "Chest/Triceps" },
    { name: "Barbell Bench Press", sets: 4, category: "Chest" },
    { name: "Dumbbell Overhead Press", sets: 3, category: "Shoulders" },
    { name: "Cable Crossover", sets: 3, category: "Chest" },
    { name: "Overhead Triceps Extension", sets: 3, category: "Triceps" },
    { name: "T-Bar Row / Landmine Row", sets: 3, category: "Back" },
    { name: "Face Pulls", sets: 3, category: "Rear Delts" },
    { name: "Barbell Bicep Curls", sets: 3, category: "Biceps" },
    
    // الأرجل والسلسلة الخلفية
    { name: "Deadlift", sets: 4, category: "Lower Body" },
    { name: "Lying Leg Curls", sets: 3, category: "Hamstrings" },
    { name: "Kettlebell Goblet Squat", sets: 3, category: "Legs" },
    { name: "Hip Thrust", sets: 3, category: "Glutes" },
    { name: "Standing Calf Raises", sets: 3, category: "Calves" },
    { name: "Barbell Squat", sets: 4, category: "Legs" },
    { name: "RDL (Romanian Deadlift)", sets: 3, category: "Hamstrings" },
    { name: "Bulgarian Split Squat", sets: 3, category: "Legs" },
    { name: "Adductor Machine / Cable", sets: 3, category: "Adductors" },
    { name: "Seated Calf Raises", sets: 3, category: "Calves" },
    { name: "Kettlebell Swings", sets: 3, category: "Posterior Chain" }
];

// تعبئة القائمة المنسدلة عند فتح التطبيق
window.onload = function() {
    const select = document.getElementById('exerciseSelect');
    allExercises.forEach((ex, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = `${ex.name} (${ex.category})`;
        select.appendChild(option);
    });
    loadHistory();
};

function onExerciseChange() {
    const index = document.getElementById('exerciseSelect').value;
    const container = document.getElementById('exerciseCardContainer');
    container.innerHTML = '';

    if (index === "") return;

    let ex = allExercises[index];
    let exDiv = document.createElement('div');
    exDiv.className = 'exercise-card';
    exDiv.innerHTML = `<h3>${ex.name} (عدد الجلسات المقترحة: ${ex.sets})</h3>`;

    let setsContainer = document.createElement('div');
    setsContainer.id = `sets-container`;

    for (let i = 1; i <= ex.sets; i++) {
        let setRow = document.createElement('div');
        setRow.className = 'set-row';
        setRow.innerHTML = `
            <span>جلسة ${i}:</span>
            <input type="number" placeholder="الوزن (كج)" id="weight-${i}" class="input-weight">
            <input type="number" placeholder="التكرارات" id="reps-${i}" class="input-reps">
        `;
        setsContainer.appendChild(setRow);
    }

    let saveBtn = document.createElement('button');
    saveBtn.className = 'save-set-btn';
    saveBtn.innerText = `حفظ تمرين ${ex.name}`;
    saveBtn.onclick = function() { saveExercise(ex.name, ex.sets); };

    exDiv.appendChild(setsContainer);
    exDiv.appendChild(saveBtn);
    container.appendChild(exDiv);
}

function saveExercise(exName, totalSets) {
    let setsData = [];
    let totalWeightLifted = 0;

    for (let i = 1; i <= totalSets; i++) {
        let wField = document.getElementById(`weight-${i}`);
        let rField = document.getElementById(`reps-${i}`);
        if (!wField || !rField) continue;

        let w = parseFloat(wField.value) || 0;
        let r = parseInt(rField.value) || 0;
        if (w > 0 && r > 0) {
            setsData.push({ set: i, weight: w, reps: r });
            totalWeightLifted += (w * r);
        }
    }

    if (setsData.length === 0) {
        return alert('يرجى تعبئة وزنة وتكرارات لجلسة واحدة على الأقل!');
    }

    let estimatedCals = Math.round(totalWeightLifted * 0.05 + (totalSets * 12));

    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        text: `تمرين: ${exName} (${setsData.length}/${totalSets} جلسات مسجلة)`,
        cals: estimatedCals
    };

    saveRecord(record);
    document.getElementById('exerciseSelect').value = "";
    document.getElementById('exerciseCardContainer').innerHTML = "";
    alert('تم حفظ التمرين بنجاح! 🔥');
}

function saveCardio() {
    let name = document.getElementById('cardioName').value;
    let mins = parseInt(document.getElementById('cardioMins').value);

    if (!name || !mins) {
        return alert('يرجى إدخال نوع الكارديو والمدة!');
    }

    let cals = Math.round(mins * 9);
    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        text: `كارديو: ${name} | ${mins} دقيقة`,
        cals: cals
    };

    saveRecord(record);
    document.getElementById('cardioName').value = '';
    document.getElementById('cardioMins').value = '';
    alert('تم حفظ الكارديو بنجاح! 🏃‍♂️');
}

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
