const allExercises = [
    { name: "Barbell Strict Overhead Press", sets: 4, category: "أكتاف" },
    { name: "Pull-ups (سحب واسع)", sets: 3, category: "ظهر" },
    { name: "Weighted Pull-ups", sets: 4, category: "ظهر" },
    { name: "Incline Dumbbell Bench Press", sets: 3, category: "صدر" },
    { name: "Barbell Pendlay Rows", sets: 3, category: "ظهر" },
    { name: "Dumbbell Lateral Raises", sets: 3, category: "أكتاف جانبي" },
    { name: "Barbell Shrugs", sets: 3, category: "ترابس" },
    { name: "Dips", sets: 3, category: "صدر وتراي" },
    { name: "Weighted Dips", sets: 3, category: "صدر وتراي" },
    { name: "Barbell Bench Press", sets: 4, category: "صدر" },
    { name: "Dumbbell Overhead Press", sets: 3, category: "أكتاف" },
    { name: "Cable Crossover", sets: 3, category: "صدر" },
    { name: "Overhead Triceps Extension", sets: 3, category: "ترايسبس" },
    { name: "T-Bar Row / Landmine Row", sets: 3, category: "ظهر" },
    { name: "Face Pulls", sets: 3, category: "أكتاف خلفي" },
    { name: "Barbell Bicep Curls", sets: 3, category: "بايسبس" },
    { name: "Deadlift", sets: 4, category: "سلسلة خلفية" },
    { name: "Lying Leg Curls", sets: 3, category: "أفخاذ خلفية" },
    { name: "Kettlebell Goblet Squat", sets: 3, category: "أرجل" },
    { name: "Hip Thrust", sets: 3, category: "أرداف" },
    { name: "Standing Calf Raises", sets: 3, category: "بطات" },
    { name: "Barbell Squat", sets: 4, category: "أرجل" },
    { name: "RDL (Romanian Deadlift)", sets: 3, category: "أفخاذ خلفية" },
    { name: "Bulgarian Split Squat", sets: 3, category: "أرجل" },
    { name: "Adductor Machine / Cable", sets: 3, category: "ضامة" },
    { name: "Seated Calf Raises", sets: 3, category: "بطات" },
    { name: "Kettlebell Swings", sets: 3, category: "سلسلة خلفية" }
];

// دالة تهيئة التطبيق (تشتغل فوراً)
function initApp() {
    const select = document.getElementById('exerciseSelect');
    if(select) {
        select.innerHTML = '<option value="">-- اختر التمرين من القائمة --</option>';
        allExercises.forEach((ex, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = `${ex.name} (${ex.category})`;
            select.appendChild(option);
        });
    }
    loadHistory();
}

function onExerciseChange() {
    const index = document.getElementById('exerciseSelect').value;
    const container = document.getElementById('exerciseCardContainer');
    container.innerHTML = '';

    if (index === "") return;

    let ex = allExercises[index];
    let exDiv = document.createElement('div');
    exDiv.className = 'exercise-card';
    exDiv.innerHTML = `<h3 style="color:#4facfe; text-align:center;">${ex.name} <br><small>(الجلسات المقترحة: ${ex.sets})</small></h3>`;

    let setsContainer = document.createElement('div');
    setsContainer.id = `sets-container`;

    for (let i = 1; i <= ex.sets; i++) {
        let setRow = document.createElement('div');
        setRow.className = 'set-row';
        setRow.innerHTML = `
            <span>جلسة ${i}:</span>
            <input type="number" placeholder="الوزن" id="weight-${i}">
            <input type="number" placeholder="العدات" id="reps-${i}">
        `;
        setsContainer.appendChild(setRow);
    }

    let saveBtn = document.createElement('button');
    saveBtn.className = 'save-set-btn';
    saveBtn.innerText = `حفظ بيانات التمرين`;
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
        return alert('يا وحش، عبّي وزن وتكرار لجلسة واحدة على الأقل عشان نحفظها!');
    }

    let estimatedCals = Math.round(totalWeightLifted * 0.05 + (totalSets * 12));

    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        text: `تمرين: ${exName} (${setsData.length}/${totalSets} جلسات)`,
        cals: estimatedCals
    };

    saveRecord(record);
    document.getElementById('exerciseSelect').value = "";
    document.getElementById('exerciseCardContainer').innerHTML = "";
    alert('تم حفظ التمرين بالنجاح!');
}

function saveCardio() {
    let name = document.getElementById('cardioName').value;
    let mins = parseInt(document.getElementById('cardioMins').value);

    if (!name || !mins) {
        return alert('أدخل نوع الكارديو والمدة بشكل صحيح!');
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
    alert('عاش، تم حفظ الكارديو!');
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
    if(!list) return;
    
    list.innerHTML = '';
    
    const today = new Date().toLocaleDateString('en-GB');
    const todayHistory = history.filter(item => item.date === today);

    todayHistory.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = `${item.text} <br><span class="cals">🔥 حرقت تقريباً: ${item.cals} سعرة</span>`;
        list.appendChild(li);
    });
}

// تشغيل التهيئة فوراً
initApp();
