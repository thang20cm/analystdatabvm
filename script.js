document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileUpload);
});

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (!Array.isArray(data)) {
                throw new Error('Invalid JSON structure: expected an array');
            }
            displayReport(data);
            analyzeData(data);
            analyzeInsurance(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Invalid JSON file. Please check the console for more details.');
        }
    };
    reader.readAsText(file);
}

function displayReport(data) {
    const reportDiv = document.getElementById('report');
    let html = '<table>';
    html += '<tr>';

    // Create table headers
    for (const key in data[0]) {
        html += `<th>${key}</th>`;
    }
    html += '</tr>';

    // Create table rows
    data.forEach(item => {
        html += '<tr>';
        for (const key in item) {
            html += `<td>${item[key]}</td>`;
        }
        html += '</tr>';
    });

    html += '</table>';
    reportDiv.innerHTML = html;
}

function analyzeData(data) {
    const analysisDiv = document.getElementById('analysis');
    const diagnosisCounts = {};
    const totalPatients = data.length;

    data.forEach(item => {
        if (item['Chẩnđoán']) {
            const diagnoses = item['Chẩnđoán'].split(';');
            diagnoses.forEach(diagnosis => {
                if (diagnosisCounts[diagnosis]) {
                    diagnosisCounts[diagnosis]++;
                } else {
                    diagnosisCounts[diagnosis] = 1;
                }
            });
        }
    });

    // Convert diagnosisCounts to an array and calculate percentages
    const diagnosisArray = Object.keys(diagnosisCounts).map(diagnosis => {
        return {
            diagnosis: diagnosis,
            count: diagnosisCounts[diagnosis],
            percentage: ((diagnosisCounts[diagnosis] / totalPatients) * 100).toFixed(2)
        };
    });

    // Sort by percentage in descending order
    diagnosisArray.sort((a, b) => b.percentage - a.percentage);

    // Create HTML for sorted analysis
    let html = '<h2>Phân tích dữ liệu</h2>';
    html += '<table><tr><th>Chẩn đoán</th><th>Số lượng</th><th>%</th></tr>';
    diagnosisArray.forEach(item => {
        html += `<tr><td>${item.diagnosis}</td><td>${item.count}</td><td>${item.percentage}</td></tr>`;
    });
    html += '</table>';
    
    analysisDiv.innerHTML = html;
}

function analyzeInsurance(data) {
    const insuranceAnalysisDiv = document.getElementById('insurance-analysis');
    const totalPatients = data.length;
    const patientsWithInsurance = data.filter(item => item['Đốitượng'] === 'Viện phí có thẻ').length;
    const patientsWithoutInsurance = totalPatients - patientsWithInsurance;

    const insurancePercentage = ((patientsWithInsurance / totalPatients) * 100).toFixed(2);
    const noInsurancePercentage = ((patientsWithoutInsurance / totalPatients) * 100).toFixed(2);

    let html = '<h2>Phân tích viện phí</h2>';
    html += '<table><tr><th>Loại bệnh nhân</th><th>Số lượng</th><th>Phần trăm</th></tr>';
    html += `<tr><td>Viện phí có thẻ</td><td>${patientsWithInsurance}</td><td>${insurancePercentage} %</td></tr>`;
    html += `<tr><td>Viện phí</td><td>${patientsWithoutInsurance}</td><td>${noInsurancePercentage} %</td></tr>`;
    html += '</table>';

    insuranceAnalysisDiv.innerHTML = html;
}
