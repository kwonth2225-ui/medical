const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";[cite: 3]

function isHolidayOrWeekend(d) {
  // 토(6), 일(0) 자동 판정
  return d.getDay() === 0 || d.getDay() === 6;[cite: 3]
}

function isNight(d) {
  const h = d.getHours();[cite: 3]
  return h >= 18 || h < 9;[cite: 3]
}

function autoSurcharge() {
  const d = new Date();[cite: 3]
  return isHolidayOrWeekend(d) || isNight(d);[cite: 3]
}

function calculate() {
  const distance = Math.max(0, Number($("distance").value) || 0);[cite: 3]
  const wait = Math.max(0, Number($("wait").value) || 0);[cite: 3]

  // 추가거리 계산 (10km 초과분)
  const extraKm = Math.max(0, distance - 10);[cite: 3]
  const extraFee = extraKm * 2300;[cite: 3]

  // 할증 여부 판단 (기본 19,100원 + 초과 km당 460원)
  const surcharge = $("manualSurcharge").checked || autoSurcharge();[cite: 3]
  const surchargeFee = surcharge ? (19100 + extraKm * 460) : 0;[cite: 3]

  // 대기요금 계산 (30분 초과 시 10분당 6,000원 고정 - 할증 미적용)
  const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);[cite: 3]
  const waitFee = waitUnits * 6000;[cite: 3]

  // 최종 총액 합산
  const total = 95500 + extraFee + surchargeFee + waitFee;[cite: 3]

  // 화면 출력
  $("total").innerHTML = Math.round(total).toLocaleString("ko-KR") + "<span>원</span>";[cite: 3]
  $("baseFee").textContent = money(95500);[cite: 3]
  $("extraKm").textContent = extraKm.toFixed(2) + " km";[cite: 3]
  $("extraFee").textContent = money(extraFee);[cite: 3]
  $("surchargeFee").textContent = money(surchargeFee);[cite: 3]
  $("waitFee").textContent = money(waitFee);[cite: 3]

  const label = $("surchargeLabel");[cite: 3]
  label.textContent = surcharge ? "할증 적용" : "정상요금";[cite: 3]
  label.className = surcharge ? "active" : "normal";[cite: 3]
}

// 이벤트 연결
$("calc").addEventListener("click", calculate);[cite: 3]
["distance", "wait", "manualSurcharge"].forEach(id => {
  $(id).addEventListener("input", calculate);[cite: 3]
  $(id).addEventListener("change", calculate); // 키보드 완료/스위치 전환 시 즉시 반영
});

$("reset").addEventListener("click", () => {
  $("distance").value = "";[cite: 3]
  $("wait").value = "";[cite: 3]
  $("manualSurcharge").checked = false;[cite: 3]
  calculate();[cite: 3]
});

calculate();[cite: 3]
