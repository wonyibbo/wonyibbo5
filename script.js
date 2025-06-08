// 학교 정보 설정
const SCHOOL_INFO = {
    ATPT_OFCDC_SC_CODE: 'B10',  // 교육청 코드
    SD_SCHUL_CODE: '7010810'    // 학교 코드
};

// 날짜 형식 변환 함수 (YYYY-MM-DD -> YYYYMMDD)
function formatDate(date) {
    return date.replace(/-/g, '');
}

// 급식 정보를 표시하는 콜백 함수
function displayMealInfo(data) {
    const mealResult = document.getElementById('mealResult');
    
    if (data.RESULT && data.RESULT.CODE === 'INFO-200') {
        mealResult.innerHTML = '해당 날짜의 급식 정보가 없습니다.';
        return;
    }

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
        const mealData = data.mealServiceDietInfo[1].row[0];
        const menu = mealData.DDISH_NM.replace(/<br\/>/g, '\n');
        
        mealResult.innerHTML = `
            <p><strong>날짜:</strong> ${mealData.MLSV_YMD}</p>
            <p><strong>급식 종류:</strong> ${mealData.MMEAL_SC_NM}</p>
            <p><strong>메뉴:</strong></p>
            <p>${menu}</p>
        `;
    } else {
        mealResult.innerHTML = '급식 정보를 찾을 수 없습니다.';
    }
}

// 급식 정보 가져오기
function getMealInfo() {
    const dateInput = document.getElementById('dateInput');
    const mealResult = document.getElementById('mealResult');
    
    if (!dateInput.value) {
        alert('날짜를 선택해주세요.');
        return;
    }

    const formattedDate = formatDate(dateInput.value);
    
    // 기존 스크립트 태그 제거
    const existingScript = document.getElementById('mealScript');
    if (existingScript) {
        existingScript.remove();
    }

    // JSONP 스크립트 생성
    const script = document.createElement('script');
    script.id = 'mealScript';
    script.src = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${SCHOOL_INFO.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SCHOOL_INFO.SD_SCHUL_CODE}&MLSV_YMD=${formattedDate}&Type=json&callback=displayMealInfo`;
    
    script.onerror = function() {
        mealResult.innerHTML = `
            <p>급식 정보를 가져오는 중 오류가 발생했습니다.</p>
            <p>다음 사항을 확인해주세요:</p>
            <ol>
                <li>인터넷 연결을 확인해주세요.</li>
                <li>학교 코드와 교육청 코드가 올바른지 확인해주세요.</li>
                <li>선택한 날짜가 유효한지 확인해주세요.</li>
            </ol>
        `;
    };

    document.body.appendChild(script);
}

// 페이지 로드 시 오늘 날짜 설정
window.onload = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('dateInput').value = `${year}-${month}-${day}`;
};
