// الجدول المعتمد مقسم حسب الفئات
const workoutSchedule = {
    "Upper Body": [
        { name: "Barbell Strict Overhead Press", sets: 4 },
        { name: "Pull-ups (سحب واسع)", sets: 3 },
        { name: "Incline Dumbbell Bench Press", sets: 3 },
        { name: "Barbell Pendlay Rows", sets: 3 },
        { name: "Dumbbell Lateral Raises", sets: 3 },
        { name: "Barbell Shrugs", sets: 3 },
        { name: "Dips", sets: 3 }
    ],
    "Lower Body": [
        { name: "Deadlift", sets: 4 },
        { name: "Lying Leg Curls", sets: 3 },
        { name: "Kettlebell Goblet Squat", sets: 3 },
        { name: "Hip Thrust", sets: 3 },
        { name: "Standing Calf Raises", sets: 3 }
    ],
    "Push": [
        { name: "Barbell Bench Press", sets: 4 },
        { name: "Dumbbell Overhead Press", sets: 3 },
        { name: "Weighted Dips", sets: 3 },
        { name: "Cable Crossover", sets: 3 },
        { name: "Overhead Triceps Extension", sets: 3 }
    ],
    "Pull": [
        { name: "Weighted Pull-ups", sets: 4 },
        { name: "T-Bar Row / Landmine Row", sets: 3 },
        { name: "Kettlebell Swings", sets: 3 },
        { name: "Face Pulls", sets: 3 },
        { name: "Barbell Bicep Curls", sets: 3 }
    ],
    "Legs": [
        { name: "Barbell Squat", sets: 4 },
        { name: "RDL (Romanian Deadlift)", sets: 3 },
        { name: "Bulgarian Split Squat", sets: 3 },
        { name: "Adductor Machine / Cable", sets: 3 },
        { name: "Seated Calf Raises", sets: 3 }
    ]
};

// تحميل السجل عند فتح التطبيق
window.onload = function() {
    loadHistory();
};

// دالة تتنفذ لما تختار الفئة الأساسية
function onCategoryChange() {
    const category = document.getElementById('categorySelect').value;
    const exGroup = document.getElementById('exerciseGroup');
    const exSelect = document.getElementById('exerciseSelect');
    const container = document.getElementById('exerciseCardContainer');

    // تصفير الخانات
    container.innerHTML = '';
    exSelect.innerHTML = '<option value="">-- اختر التمرين --</option>';

    if (category && workoutSchedule[category]) {
        // إظهار القائمة الثانية وتعبئتها
        exGroup.style.display = 'block';
        workoutSchedule[category].forEach((ex, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = ex.name;
            exSelect.appendChild(option);
        });
    } else {
        // إخفاء القائمة الثانية إذا لم يتم اختيار فئة
        exGroup.style.display = 'none';
    }
}

// دالة تتنفذ لما تختار التمرين نفسه
function onExerciseChange() {
    const category = document.getElementById('categorySelect').value;
    const index = document.getElementById('exerciseSelect').value;
    const container = document.getElementById('exerciseCardContainer');
    
    container.innerHTML = '';

    if (index === "" || !category) return;

    let ex = workoutSchedule[category][index];
    let exDiv = document.createElement('div');
    exDiv.className = 'exercise-card';
    exDiv.innerHTML = `<h3 style="color:#4facfe; text-align:center;">${ex.name} <br><small>(عدد الجلسات: ${ex.sets})</small></h3>`;

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

// حفظ بيانات التمرين
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
        return alert('الرجاء إدخال وزن وتكرار لجلسة واحدة على الأقل قبل الحفظ!');
    }

    let estimatedCals = Math.round(totalWeightLifted * 0.05 + (totalSets * 12));

    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        text: `تمرين: ${exName} (${setsData.length}/${totalSets} جلسات)`,
        cals: estimatedCals
    };

    saveRecord(record);
    
    // إعادة تعيين القوائم بعد الحفظ
    document.getElementById('exerciseSelect').value = "";
    document.getElementById('exerciseCardContainer').innerHTML = "";
    alert('تم الحفظ في السجل بنجاح!');
}

// حفظ الكارديو
function saveCardio() {
    let name = document.getElementById('cardioName').value;
    let mins = parseInt(document.getElementById('cardioMins').value);

    if (!name || !mins) {
        return alert('يرجى إدخال نوع الكارديو والمدة بشكل صحيح!');
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
    alert('تم حفظ نشاط الكارديو!');
}

// تخزين وعرض السجل
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
