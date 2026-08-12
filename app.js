const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function calculate() {
  const distance = Math.max(0, Number($("distance").value) || 0);
  const wait = Math.max(0, Number($("wait").value) || 0);

  // 추가거리 계산 (10km 초과분)
  const extraKm = Math.max(0, distance - 10);
  const extraFee = extraKm * 2300;

  // 스위치 ON/OFF로만 할증 적용 결정 (시간 자동 판정 제거)
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
  if (label) {
    label.textContent = surcharge ? "할증 적용" : "정상요금";
    label.className = surcharge ? "active" : "normal";
  }
}

// 버튼 및 입력 이벤트 연결
if ($("calc")) $("calc").addEventListener("click", calculate);

["distance", "wait", "manualSurcharge"].forEach(id => {
  const el = $(id);
  if (el) {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  }
});

// 초기화 버튼 클릭 시 입력값 및 스위치 OFF로 초기화
if ($("reset")) {
  $("reset").addEventListener("click", () => {
    if ($("distance")) $("distance").value = "";
    if ($("wait")) $("wait").value = "";
    if ($("manualSurcharge")) $("manualSurcharge").checked = false;
    calculate();
  });
}

// 페이지 첫 실행 시 계산
calculate();
