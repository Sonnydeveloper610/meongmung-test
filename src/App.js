import React, { useState, useEffect } from "react";
import ko from "./locales/ko.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

// 언어 감지 & 이미지 지정
const localeMap = { ko, en, es };
function detectLang() {
  const lang = navigator.language || navigator.userLanguage || "ko";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("es")) return "es";
  return "en";
}
const getDefaultLocale = () => localeMap[detectLang()] || ko;

const dogResultEmojis = ["🤪🐶", "🐕‍🦺😏", "🐩💫", "🦮🥹"];

function App() {
  const [lang, setLang] = useState(detectLang());
  const [locale, setLocale] = useState(getDefaultLocale());
  const [startImg, setStartImg] = useState(`/images/start-${detectLang()}.png`);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultIdx, setResultIdx] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // 질문/답변
  const questions = [
    { q: locale.question1, a: locale.answers1 },
    { q: locale.question2, a: locale.answers2 },
    { q: locale.question3, a: locale.answers3 },
    { q: locale.question4, a: locale.answers4 },
    { q: locale.question5, a: locale.answers5 },
    { q: locale.question6, a: locale.answers6 },
    { q: locale.question7, a: locale.answers7 }
  ];
  const resultList = [
    locale.result1, locale.result2, locale.result3, locale.result4
  ];
  const percent = step >= 0 ? Math.floor((answers.length / questions.length) * 100) : 0;

  function getResultIdx() {
    const counts = [0, 0, 0, 0];
    answers.forEach(idx => { counts[idx] += 1; });
    let max = counts[0], maxIdx = 0;
    for (let i = 1; i < 4; ++i) if (counts[i] > max) { max = counts[i]; maxIdx = i; }
    return maxIdx;
  }

  const handleCopy = url => {
    navigator.clipboard?.writeText(url || window.location.href);
    alert(locale.copy_alert);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes wobble {0%{transform:rotate(-7deg);}100%{transform:rotate(7deg);}}
    @keyframes bounce {0%{transform:translateY(0);}100%{transform:translateY(-14px);}}
    @keyframes paw {0%{transform:translateX(0);}100%{transform:translateX(32px);}}
    @keyframes spin {0%{transform:rotate(0);}100%{transform:rotate(360deg);}}
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        setShowResult(true);
        setResultIdx(getResultIdx());
      }, 3000);
    }
    // eslint-disable-next-line
  }, [loading]);
  
  useEffect(() => {
    setLocale(localeMap[lang]);
    setStartImg(`/images/start-${lang}.png`);
  }, [lang]);

  const resultUrl = window.location.origin + window.location.pathname + `?result=${resultIdx}`;

  return (
    <div
      style={{
        maxWidth: 500, width: "100%", minHeight: "100vh", margin: "0 auto",
        background: "#fffaff", padding: 00, fontFamily: "Pretendard, sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}
    >
      {/* 시작화면: 이미지만 클릭 가능 */}
      {step === -1 && (
        <img
          alt="멍뭉미 테스트 시작 카드"
          src={startImg}
          style={{
            width: "100%",
            borderRadius: 28,
            marginBottom: 32,
            boxShadow: "0 4px 18px #f1e5ff83",
            cursor: "pointer",
            transition: "transform 0.16s"
          }}
          onClick={() => setStep(0)}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        />
      )}

      {/* 퀴즈화면 */}
      {step >= 0 && step < questions.length && (
        <>
          {/* HP 프로그래스바 */}
          <div style={{
            width: "100%",
            margin: "12px 0 24px 0",
            background: "#f7e9fa",
            borderRadius: 20,
            border: "1.5px solid #d8b6fa",
            height: 19,
            position: "relative"
          }}>
            <div style={{
              width: `${percent}%`,
              height: 19,
              background: "linear-gradient(90deg,#ffaae0 0%,#b6e1ff 100%)",
              borderRadius: 20,
              transition: "width 0.7s cubic-bezier(.57,1.63,.56,.99)",
              boxShadow: "0 1px 8px #f3edfa60"
            }} />
            <span style={{
              position: "absolute",
              top: 0, left: `${percent - 8}%`,
              fontSize: 24,
              transform: "translateY(-140%)",
              animation: "paw 2s infinite alternate"
            }}>🐕</span>
          </div>
          {/* 질문 */}
          <div style={{
            fontSize: 22,
            marginBottom: 18,
            fontWeight: 800,
            color: "#7a41ff",
            display: "flex",
            alignItems: "center"
          }}>
            <span role="img" aria-label="dog" style={{
              fontSize: 35,
              marginRight: 14,
              animation: "wobble 1.0s infinite alternate"
            }}>🐶</span>
            {questions[step].q}
          </div>
          {/* 답변 */}
          {questions[step].a.map((ans, idx) =>
            <button
              key={idx}
              onClick={() => {
                setAnswers([...answers, idx]);
                setTimeout(() => setStep(step + 1), 230);
              }}
              style={{
                width: "100%",
                background: "#fff9e8",
                color: "#292b4d",
                border: "none",
                borderRadius: 14,
                padding: "18px",
                marginBottom: 13,
                fontSize: 20,
                fontWeight: 600,
                boxShadow: "0 1px 8px #ffe6f080",
                display: "flex",
                alignItems: "center",
                gap: 15,
                justifyContent: "space-between"
              }}
            >
              <span style={{ flexGrow: 1, textAlign: "left" }}>{ans}</span>
              <span role="img" aria-label="장난치는강아지" style={{
                fontSize: 27,
                animation: "bounce 0.85s .15s infinite alternate"
              }}>🐕</span>
            </button>
          )}
        </>
      )}

      {/* 프로그래스바 만렙+결과보기 (마지막 문항 이후) */}
      {step === questions.length && !loading && !showResult && (
        <div style={{ width: "100%", textAlign: "center", marginTop: 40 }}>
          <div style={{
            width: "100%",
            height: 24,
            background: "#f1d0fe73",
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: 24
          }}>
            <div style={{
              width: "100%",
              height: 24,
              background: "linear-gradient(90deg,#fcb1ee 0%,#b1e6fc 100%)",
              animation: "healUp 1.4s cubic-bezier(.48,1.74,.67,.91)"
            }} />
          </div>
          <button
            onClick={() => setLoading(true)}
            style={{
              width: "83%",
              marginTop: 12,
              background: "#bfcfff",
              color: "#fff",
              borderRadius: 16,
              fontSize: 22,
              fontWeight: 700,
              border: "none",
              padding: "16px 0",
              boxShadow: "0 2px 10px #d0eaff80"
            }}
          >
            {locale.show_result}
            <span role="img" aria-label="dog" style={{ marginLeft: 10 }}>🐾</span>
          </button>
        </div>
      )}

      {/* 로딩(결과 분석중) */}
      {loading && (
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "340px",
          justifyContent: "center"
        }}>
          <div style={{
            width: 78,
            height: 78,
            border: "7px solid #ffe2fb",
            borderTop: "7px solid #aadafe",
            borderRadius: "50%",
            animation: "spin 1.1s linear infinite"
          }} />
          <div style={{
            fontSize: 22,
            color: "#7a41ff",
            fontWeight: 700,
            marginTop: 26
          }}>
            <span role="img" aria-label="멍패" style={{
              fontSize: 32,
              marginRight: 10,
              animation: "wobble 0.9s infinite alternate"
            }}>🐶</span>
            {locale.loading}
          </div>
          <div style={{
            display: "flex", gap: 13, marginTop: 23, fontSize: 37
          }}>
            <span role="img" aria-label="dog">🐾</span>
            <span role="img" aria-label="dog">🦴</span>
            <span role="img" aria-label="dog">🐾</span>
          </div>
        </div>
      )}

      {/* 결과 페이지 */}
      {showResult && typeof resultIdx === "number" && (
        <div style={{ width: "100%", padding: "13px 0" }}>
          <div style={{
            width: "100%",
            maxWidth: 440,
            margin: "0 auto",
            background: "#fffaff",
            borderRadius: 32,
            boxShadow: "0 2px 18px #aad2f420",
            padding: "40px 20px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            border: "5px dashed #e4e6ff"
          }}>
            <div style={{ fontSize: 46, marginBottom: 10, animation: "bounce 1.15s infinite alternate" }}>
              {dogResultEmojis[resultIdx]}
            </div>
            <textarea
              style={{
                width: "100%",
                resize: "none",
                border: "none",
                background: "transparent",
                fontWeight: 700,
                fontSize: 20,
                color: "#432188",
                minHeight: 250,
                marginTop: 14,
                marginBottom: 12,
                textAlign: "center",
                outline: "none"
              }}
              value={resultList[resultIdx]}
              readOnly
            />
            <div style={{ fontSize: 16, color: "#f55", fontWeight: 800, margin: "18px 0 12px" }}>
              😂🐶 오늘의 멍뭉미에 취해라! 덕질각!
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 18,
              marginTop: 22
            }}>
              <button
                onClick={() => handleCopy(resultUrl)}
                style={{
                  background: "#ffaae0",
                  border: "none",
                  borderRadius: 13,
                  padding: "13px 19px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#3b1743",
                  cursor: "pointer",
                  boxShadow: "0 1px 10px #ffd5f283"
                }}
              >
                📲🐾 {locale.share_result}
              </button>
              <button
                onClick={() => handleCopy(window.location.origin + window.location.pathname)}
                style={{
                  background: "#b1e6fc",
                  border: "none",
                  borderRadius: 13,
                  padding: "13px 19px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#18414b",
                  cursor: "pointer",
                  boxShadow: "0 1px 10px #b1e6fc63"
                }}
              >
                🌈 {locale.share_app}
              </button>
            </div>
            <div style={{
              fontSize: 14,
              color: "#ac79f9",
              marginTop: 22,
              fontWeight: 600
            }}>
              “아무생각 없이 살아도 댕댕미는 만렙이다 멍!” 🦴
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
