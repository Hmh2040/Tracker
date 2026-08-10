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

window.onload = function() {
    loadHistory();
};

function onCategoryChange() {
    const category = document.getElementById('categorySelect').value;
    const exGroup = document.getElementById('exerciseGroup');
    const exSelect = document.getElementById('exerciseSelect');
    const container = document.getElementById('exerciseCardContainer');

    container.innerHTML = '';
    exSelect.innerHTML = '<option value="">-- اختر التمرين --</option>';

    if (category && workoutSchedule[category]) {
        exGroup.style.display = 'block';
        workoutSchedule[category].forEach((ex, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = ex.name;
            exSelect.appendChild(option);
        });
    } else {
        exGroup.style.display = 'none';
    }
}

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

function saveExercise(exName, totalSets) {
    let setsData = [];
    let totalWeightLifted = 0;
    let detailsHtml = `<div class="set-details">`;

    for (let i = 1; i <= totalSets; i++) {
        let wField = document.getElementById(`weight-${i}`);
        let rField = document.getElementById(`reps-${i}`);
        if (!wField || !rField) continue;

        let w = parseFloat(wField.value) || 0;
        let r = parseInt(rField.value) || 0;
        if (w > 0 && r > 0) {
            setsData.push({ set: i, weight: w, reps: r });
            totalWeightLifted += (w * r);
            detailsHtml += `<div>جلسة ${i}: ${w} كج × ${r} عدات</div>`;
        }
    }
    
    detailsHtml += `</div>`;

    if (setsData.length === 0) {
        return alert('الرجاء إدخال وزن وتكرار لجلسة واحدة على الأقل قبل الحفظ!');
    }

    let estimatedCals = Math.round(totalWeightLifted * 0.05 + (totalSets * 12));

    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        timestamp: new Date().getTime(), // لترتيب التواريخ لاحقاً
        text: `<strong>${exName}</strong> ${detailsHtml}`,
        cals: estimatedCals
    };

    saveRecord(record);
    
    document.getElementById('exerciseSelect').value = "";
    document.getElementById('exerciseCardContainer').innerHTML = "";
    alert('تم الحفظ في السجل بنجاح!');
}

function saveCardio() {
    let name = document.getElementById('cardioName').value;
    let mins = parseInt(document.getElementById('cardioMins').value);

    if (!name || !mins) {
        return alert('يرجى إدخال نوع الكارديو والمدة بشكل صحيح!');
    }

    let cals = Math.round(mins * 9);
    let record = {
        date: new Date().toLocaleDateString('en-GB'),
        timestamp: new Date().getTime(),
        text: `<strong>كارديو: ${name}</strong> <br><div class="set-details">المدة: ${mins} دقيقة</div>`,
        cals: cals
    };

    saveRecord(record);
    document.getElementById('cardioName').value = '';
    document.getElementById('cardioMins').value = '';
    alert('تم حفظ نشاط الكارديو!');
}

function saveRecord(record) {
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    history.push(record);
    localStorage.setItem('workoutHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const container = document.getElementById('historyContainer');
    if(!container) return;
    
    container.innerHTML = '';

    if (history.length === 0) {
        container.innerHTML = '<div class="empty-history">لا يوجد سجلات سابقة، ابدأ تمرينك الآن!</div>';
        return;
    }

    // ترتيب السجلات من الأحدث للأقدم بناءً على الوقت
    history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // تجميع السجلات حسب التاريخ
    const groupedByDate = {};
    history.forEach(item => {
        if (!groupedByDate[item.date]) {
            groupedByDate[item.date] = [];
        }
        groupedByDate[item.date].push(item);
    });

    // رسم السجل في الصفحة
    for (const date in groupedByDate) {
        // إنشاء عنوان التاريخ
        let dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.innerText = `تاريخ: ${date}`;
        container.appendChild(dateHeader);

        // إنشاء قائمة التمارين لهذا التاريخ
        let ul = document.createElement('ul');
        ul.className = 'history-ul';
        
        groupedByDate[date].forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `${item.text} <span class="cals">🔥 حرقت تقريباً: ${item.cals} سعرة</span>`;
            ul.appendChild(li);
        });
        
        container.appendChild(ul);
    }
}
