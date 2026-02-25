const caseLore = {
  caseTitle: "사건 17호: 서고 봉인 조작 사건",
  backstory:
    "8년 전, 국가연구소 서고에서 핵심 증거 원본이 사라졌고 사건은 내부 실수로 종결됐다. 최근 익명 제보로 당시 수사기록이 위조됐다는 사실이 드러났다.",
  mission:
    "당신은 재수사팀의 유일한 현장 분석관이다. 15분 안에 봉인 해제 전 과정을 복원해 원본 증거를 확보해야 한다.",
  stakes:
    "시간이 초과되면 자동 회수 프로토콜이 실행되어 서고가 완전 봉인되고, 사건은 다시 미제로 남는다.",
};

const stageFlow = [
  {
    stage: 1,
    key: "desk",
    chapterTitle: "챕터 1: 봉인된 사무실",
    chapterLead: "첫 단서인 찢긴 메모에서 방향 코드의 원본 규칙을 복원한다.",
    chapterBrief:
      "초동 수사팀이 가장 먼저 확보했던 책상 메모다. 누가 메모를 일부러 찢어 기록 순서를 숨겼다는 정황이 있다.",
    chapterTension:
      "복원에 실패하면 이후 퍼즐의 기준 좌표가 모두 틀어진다.",
    radioLog: [
      "통제실: 현장 진입 확인. 8년 전 봉인 코드가 아직 살아있다.",
      "분석관: 책상 메모부터 복원하겠습니다. 기준 좌표를 먼저 확정하죠.",
      "통제실: 좋다. 첫 단서가 틀리면 이후 계산 전부 무너진다.",
    ],
    chapterImage: "./assets/scene-office.svg",
    interlude:
      "메모 원본은 누군가가 일부 숫자를 바꾼 위조본과 함께 있었다. 원본 순서를 확보해 첫 토큰 Delta를 회수했다.",
  },
  {
    stage: 2,
    key: "board",
    chapterTitle: "챕터 2: 조작된 게시판",
    chapterLead: "시간 공식을 조작한 흔적을 찾아 실제 계산식을 다시 적용한다.",
    chapterBrief:
      "수사본부 게시판에는 '수사 시간표'라는 이름의 공식이 남아 있다. 하지만 공식의 일부는 보고서와 모순된다.",
    chapterTension:
      "이 챕터는 범인이 남긴 유도식과 원본 규칙을 구분해내는 과정이다.",
    radioLog: [
      "통제실: 게시판 촬영본 업링크 완료. 칠판 공식이 보고서와 안 맞는다.",
      "분석관: 누군가 의도적으로 계산 흐름을 비틀어놨습니다.",
      "통제실: 미끼 공식을 걷어내고 원본 수식만 남겨라.",
    ],
    chapterImage: "./assets/scene-boardroom.svg",
    interlude:
      "게시판 공식의 주석은 초기 수사 기록과 달랐다. 누군가 보고서 시간을 틀리게 쓰도록 유도했다.",
  },
  {
    stage: 3,
    key: "cctv",
    chapterTitle: "챕터 3: 끊긴 CCTV",
    chapterLead: "정전 로그와 복도 연결도를 합쳐 단일 이동 경로를 복원한다.",
    chapterBrief:
      "정전 구간은 우연처럼 보이지만 타임스탬프 간격이 지나치게 규칙적이다. 누군가 동선 추적을 의도적으로 어렵게 만들었다.",
    chapterTension:
      "경로를 하나로 좁히지 못하면 공모자 특정 단계에서 다중 해석이 발생한다.",
    radioLog: [
      "통제실: CCTV 로그 수신. 정전 타임스탬프가 비정상적으로 일정하다.",
      "분석관: 우발 정전이 아니라 동선 은폐용 패턴입니다.",
      "통제실: 연결도랑 겹쳐서 단일 경로를 뽑아내.",
    ],
    chapterImage: "./assets/scene-cctv.svg",
    interlude:
      "정전은 우발 장애가 아니라 계획된 블라인드 구간이었다. 경로 토큰 Sigma가 확보됐다.",
  },
  {
    stage: 4,
    key: "statement",
    chapterTitle: "챕터 4: 거짓 진술 대조",
    chapterLead: "시스템 로그와 충돌하는 진술 쌍을 찾아 공모자를 특정한다.",
    chapterBrief:
      "증인 진술은 서로 맞아 보이지만, 시스템 로그와 대조하면 최소 2개의 거짓 진술이 발견된다.",
    chapterTension:
      "한 명만 거짓이라고 판단하면 최종 보관함 매핑에서 오류가 난다.",
    radioLog: [
      "통제실: 증언 녹취 정리 완료. 모두 맞는 말처럼 들린다.",
      "분석관: 로그랑 대조하면 최소 두 진술이 동시에 거짓입니다.",
      "통제실: 공모자 쌍을 정확히 잡아. 순서도 중요하다.",
    ],
    chapterImage: "./assets/scene-interview.svg",
    interlude:
      "거짓말은 한 명이 아니었다. 진술 조작이 팀 단위로 수행됐다는 증거가 나왔다.",
  },
  {
    stage: 5,
    key: "archive",
    chapterTitle: "챕터 5: 보관함 키매핑",
    chapterLead: "공모자가 접근한 보관함의 파일 번호를 추출해 마지막 토큰을 완성한다.",
    chapterBrief:
      "보관함은 담당자 실명 대신 코드로 기록된다. 진술 대조 결과와 맞물려야 실제 접근 파일을 찾을 수 있다.",
    chapterTension:
      "여기서 얻는 토큰이 최종 잠금 4번째 자리를 결정한다.",
    radioLog: [
      "통제실: 보관함 접근기록 호출. 수정 불가 로그다.",
      "분석관: 거짓 진술자와 담당 보관함을 바로 매핑하겠습니다.",
      "통제실: 이번 번호가 최종 잠금 핵심 값이다.",
    ],
    chapterImage: "./assets/scene-archive.svg",
    interlude:
      "보관함 기록으로 누가 원본 문서에 접근했는지 확정됐다. 이제 출구 잠금 계산식만 남았다.",
  },
  {
    stage: 6,
    key: "finalDoor",
    chapterTitle: "최종 챕터: 출구 잠금장치",
    chapterLead: "토큰 5개를 변환식에 넣어 4자리 최종 코드를 산출한다.",
    chapterBrief:
      "출구 잠금은 단순 비밀번호가 아니라 수사체인 무결성 검증 장치다. 앞에서 확보한 토큰이 모두 반영되어야 열린다.",
    chapterTension:
      "한 자리라도 틀리면 잠금장치가 재초기화된다.",
    radioLog: [
      "통제실: 최종 잠금실 도착. 회수 프로토콜까지 남은 시간 3분.",
      "분석관: 토큰 5개 교차 검증 완료. 변환식 대입 시작합니다.",
      "통제실: 한 번에 끝내. 재시도하면 봉인 타이머가 당겨진다.",
    ],
    chapterImage: "./assets/scene-vault.svg",
    interlude: "",
  },
];

const hints = {
  desk: [
    "숫자 4개를 먼저 찾지 말고, 메모에서 '숫자가 무엇을 뜻하는지'를 먼저 확정하세요.",
    "배치도(위/아래/좌/우)와 열람 규칙(반시계)을 결합하면 코드 순서가 정해집니다.",
  ],
  board: [
    "분 단위는 전체가 아니라 '일의자리'를 사용합니다. 주차는 제곱 처리입니다.",
    "(분의 일의자리+시) % 10, (주차^2), (사건번호끝+보고자끝) % 10 순서입니다.",
  ],
  cctv: [
    "가장 이른 정전을 시작점으로 잡고, 연결도에서 가능한 단일 경로를 만드세요.",
    "로그 순서 경로를 얻은 뒤 마지막에 2-1 치환 규칙을 적용합니다.",
  ],
  statement: [
    "둘 다 거짓인 직책 2개를 찾고, 로그 번호가 더 빠른 쪽을 먼저 써야 합니다.",
    "정답 형식은 'gi'처럼 2글자입니다. (guard, intern)",
  ],
  archive: [
    "거짓 진술자 2명의 보관함 파일번호만 추출합니다. 순서는 알파벳 함 순서입니다.",
    "A함(경비원)과 B함(인턴)의 파일번호를 이어 붙입니다.",
  ],
  finalDoor: [
    "Delta/Omega/Sigma/Psi/Kappa 토큰의 자리 연산 결과를 차례대로 4자리로 만듭니다.",
    "정답은 6110입니다.",
  ],
};

const puzzleData = {
  desk: {
    answer: "9417",
    title: "퍼즐 1: 찢긴 현장 메모",
    description:
      "단서 이미지의 메모 복원본에서 보관함 식별코드 4개를 찾으세요.\n그 다음 배치도와 표준 열람 규칙을 적용해 4자리 코드를 만듭니다.",
    narrative:
      "초동 수사관의 마지막 수기 메모. 기록자는 '정렬 순서만 남기고 도망친다'라는 말을 적어두고 행방불명됐다.",
    image: "./assets/clue-desk.svg",
    reward: "토큰 Delta: 9-4-1-7",
  },
  board: {
    answer: "543",
    title: "퍼즐 2: 벽 게시판 공식",
    description:
      "단서 이미지의 화이트보드 공식을 적용하세요.\n공식 결과 3자리를 순서대로 입력합니다.",
    narrative:
      "조사실 칠판에 남은 공식은 범인이 남긴 미끼와 원본 규칙이 섞여 있다. 어떤 수식이 진짜인지 골라내야 한다.",
    image: "./assets/clue-board.svg",
    reward: "토큰 Omega: 5-4-3",
  },
  cctv: {
    answer: "2143",
    title: "퍼즐 3: CCTV 동선 복원",
    description:
      "정전 로그 + 연결도 + 치환 규칙으로 4자리 경로 코드를 계산하세요.",
    narrative:
      "복도 카메라는 2분 간격으로 차례차례 꺼졌다. 의도적 정전이라면 범인은 이미 경로를 알고 움직였다는 뜻이다.",
    image: "./assets/clue-cctv.svg",
    reward: "토큰 Sigma: 2-1-4-3",
  },
  statement: {
    answer: ["gi", "guardintern", "guard,intern", "경비원인턴", "경비원,인턴"],
    title: "퍼즐 4: 진술 대조",
    description:
      "거짓 진술 2명을 찾고, 로그 충돌 시각이 더 이른 순서로 입력하세요.\n(예: gi)",
    narrative:
      "신문실 녹취를 분석하면 같은 사건을 서로 다른 시간대로 말하는 구간이 있다. 공모자는 알리바이를 공유했다.",
    image: "./assets/clue-statement.svg",
    reward: "토큰 Psi: G-I",
  },
  archive: {
    answer: "5862",
    title: "퍼즐 5: 증거 보관함",
    description:
      "거짓 진술자 2명이 담당한 보관함의 파일번호를 A->D 순서로 결합하세요.",
    narrative:
      "보관함 접근기록은 수정할 수 없도록 별도 장치에 저장된다. 여기서 나오는 번호가 최종 혐의의 물증이 된다.",
    image: "./assets/clue-archive.svg",
    reward: "토큰 Kappa: 5-8-6-2",
  },
  finalDoor: {
    answer: "6110",
    title: "최종 잠금장치",
    description:
      "규칙카드:\n1) (Delta 3번째 + Omega 1번째) % 10\n2) Sigma 3번째 - Psi 글자수\n3) (Kappa 각 자리 합) % 10\n4) (Omega 마지막 + Delta 마지막) % 10",
    narrative:
      "잠금장치는 수사 연쇄가 일관될 때만 열리도록 설계됐다. 이 문을 열면 사건 17호의 원본 증거가 회수된다.",
    image: "./assets/clue-final-rule.svg",
  },
};

function getStageInfo(stageNumber) {
  return stageFlow.find((item) => item.stage === stageNumber) || stageFlow[0];
}

function nextHint(puzzleKey) {
  const count = Number(sessionStorage.getItem(`hint_${puzzleKey}`) || "0");
  const list = hints[puzzleKey] || [];
  const hint = list[Math.min(count, list.length - 1)] || "힌트가 없습니다.";

  sessionStorage.setItem(`hint_${puzzleKey}`, String(count + 1));
  gameState.hintCount += 1;
  saveState();

  return hint;
}

function resetHintSessions() {
  Object.keys(hints).forEach((key) => sessionStorage.removeItem(`hint_${key}`));
}

function normalizeAnswer(inputRaw) {
  return inputRaw.toLowerCase().replace(/\s+/g, "").trim();
}

function isCorrectAnswer(key, inputRaw) {
  const input = normalizeAnswer(inputRaw);
  const answer = puzzleData[key]?.answer;

  if (Array.isArray(answer)) {
    return answer.some((candidate) => input === normalizeAnswer(String(candidate)));
  }
  return input === normalizeAnswer(String(answer));
}
