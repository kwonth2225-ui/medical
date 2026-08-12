const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function isHolidayOrWeekend(d) {
  return d.getDay() === 0 || d.getDay() === 6;
}

function isNight(d) {
  const h = d.getHours();
  return h >= 18 || h < 9;
}

function autoSurcharge() {
  const d = new Date();
  return isHolidayOrWeekend(d) || isNight(d);
}

// 페이지가 처음 로드될 때 현재 시간이 야간/주말이면 스위치를 자동으로 켜둠
window.addEventListener("DOMContentLoaded", () => {
  if ($("manualSurcharge")) {
    $("manualSurcharge").checked = autoSurcharge();
  }
  calculate();
});

function calculate() {
  const distance = Math.max(0, Number($("distance").value) || 0);
  const wait = Math.max(0, Number($("wait").value) || 0);

  // 추가거리 계산 (10km 초과분)
  const extraKm = Math.max(0, distance - 10);
  const extraFee = extraKm * 2300;

  // [수정 포인트] 사용자가 스위치를 끄면(Unchecked) 무조건 정상요금, 켜면(Checked) 할증요금 적용
  const surcharge = $("manualSurcharge").checked;
  const surchargeFee = surcharge ? (19100 + extraKm * 460) : 0;

  // 대기요금 계산 (30분 초과 시 10분당 6,000원 고정)
  const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);
  const waitFee = waitUnits * 6000;

  // 최종 총액 합산
  const total = 95500 + extraFee + surchargeFee + waitFee;

  // 화면 출력
  $("total").innerHTML = Math.round(total).toLocaleString("ko-KR") + "<span>원</span>";
  $("baseFee").textContent = money(95500);
  $("extraKm").textContent = extraKm.toFixed(2) + " km";
  $("extraFee").textContent = money(extraFee);
  $("surchargeFee").textContent = money(surchargeFee);
  $("waitFee").textContent = money(waitFee);

  const label = $("surchargeLabel");
  label.textContent = surcharge ? "할증 적용" : "정상요금";
  label.className = surcharge ? "active" : "normal";
}

// 이벤트 연결
$("calc").addEventListener("click", calculate);
["distance", "wait", "manualSurcharge"].forEach(id => {
  if ($(id)) {
    $(id).addEventListener("input", calculate);
    $(id).addEventListener("change", calculate);
  }
});

$("reset").addEventListener("click", () => {
  $("distance").value = "";
  $("wait").value = "";
  // 초기화 시 다시 현재 시간 기준으로 스위치 설정
  $("manualSurcharge").checked = autoSurcharge();
  calculate();
});

calculate();
