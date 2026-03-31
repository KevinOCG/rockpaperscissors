"use client";

import { useMemo, useState } from "react";

type Move = "rock" | "paper" | "scissors";
type Result = "win" | "loss" | "tie";

type RoundLog = {
  round: number;
  player: Move;
  ai: Move;
  result: Result;
  goldEarned: number;
};

const MOVES: Move[] = ["rock", "paper", "scissors"];

function getResult(player: Move, ai: Move): Result {
  if (player === ai) return "tie";
  if (
    (player === "rock" && ai === "scissors") ||
    (player === "paper" && ai === "rock") ||
    (player === "scissors" && ai === "paper")
  ) {
    return "win";
  }
  return "loss";
}

function formatNum(value: number) {
  return value.toLocaleString();
}

const moveConfig: Record<
  Move,
  {
    label: string;
    mainCard: string;
    lilCard: string;
    glow: string;
  }
> = {
  rock: {
    label: "Rock",
    mainCard: "/rock.png",
    lilCard: "/lil-rock.png",
    glow: "0 0 40px rgba(96,165,250,0.22)",
  },
  paper: {
    label: "Paper",
    mainCard: "/paper.png",
    lilCard: "/lil-paper.png",
    glow: "0 0 40px rgba(244,114,182,0.22)",
  },
  scissors: {
    label: "Scissors",
    mainCard: "/scissors.png",
    lilCard: "/lil-scissors.png",
    glow: "0 0 40px rgba(245,158,11,0.22)",
  },
};

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        borderRadius: 24,
        padding: 18,
        boxShadow: accent ? accent : "none",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ChoiceButton({
  move,
  disabled,
  onClick,
}: {
  move: Move;
  disabled: boolean;
  onClick: () => void;
}) {
  const config = moveConfig[move];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: disabled ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.35)",
        color: "white",
        borderRadius: 26,
        padding: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        textAlign: "left",
        boxShadow: config.glow,
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          flexShrink: 0,
        }}
      >
        <img
          src={config.lilCard}
          alt={config.label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          {config.label}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.52)",
          }}
        >
          Choose move
        </div>
      </div>
    </button>
  );
}

function CardBack({ title }: { title: string }) {
  return (
    <div
      style={{
        width: 250,
        maxWidth: "100%",
        aspectRatio: "0.69",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.14)",
        background:
          "linear-gradient(160deg, rgba(40,40,40,0.95), rgba(10,10,10,0.98))",
        boxShadow: "0 0 40px rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Birb Reveal
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 950, marginBottom: 10 }}>?</div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
        <div
          style={{
            marginTop: 6,
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Face Down
        </div>
      </div>
      <img
        src="/logo.png"
        alt="birb"
        style={{ height: 28, opacity: 0.85, alignSelf: "center" }}
      />
    </div>
  );
}

function FlipCard({
  title,
  move,
  showFace,
}: {
  title: string;
  move: Move | null;
  showFace: boolean;
}) {
  const config = move ? moveConfig[move] : null;

  return (
    <div
      style={{
        perspective: "1200px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 250,
          maxWidth: "100%",
          aspectRatio: "0.69",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
          transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardBack title={title} />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {config ? (
            <img
              src={config.mainCard}
              alt={config.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 22,
                boxShadow: config.glow,
              }}
            />
          ) : (
            <CardBack title={title} />
          )}
        </div>
      </div>
    </div>
  );
}

function RevealPanel({
  title,
  move,
  showBack,
  showFace,
  pulse,
}: {
  title: string;
  move: Move | null;
  showBack: boolean;
  showFace: boolean;
  pulse?: boolean;
}) {
  const config = move ? moveConfig[move] : null;

  return (
    <div
      style={{
        minHeight: 440,
        borderRadius: 34,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(14px)",
        padding: 22,
        position: "relative",
        overflow: "hidden",
        boxShadow: pulse
          ? "0 0 60px rgba(255,255,255,0.10)"
          : config?.glow || "none",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {showFace ? "Revealed" : showBack ? "Ready" : "Idle"}
        </div>
      </div>

      {!showBack && !showFace ? (
        <div
          style={{
            height: 330,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            border: "1px dashed rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.03)",
            color: "rgba(255,255,255,0.45)",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Waiting for reveal
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <FlipCard title={title} move={move} showFace={showFace} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 950 }}>
              {showFace && config ? config.label : "Face Down"}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {showFace ? "Vibes card revealed" : "Locked in"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [rounds, setRounds] = useState(10);
  const [birbPerRound, setBirbPerRound] = useState(100);
  const [currentRound, setCurrentRound] = useState(1);

  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [showPlayerBack, setShowPlayerBack] = useState(false);
  const [showAiBack, setShowAiBack] = useState(false);
  const [showPlayerFace, setShowPlayerFace] = useState(false);
  const [showAiFace, setShowAiFace] = useState(false);

  const [logs, setLogs] = useState<RoundLog[]>([]);

  const totalCommitted = rounds * birbPerRound;
  const gold = useMemo(
    () => logs.reduce((sum, entry) => sum + entry.goldEarned, 0),
    [logs]
  );
  const wins = useMemo(
    () => logs.filter((entry) => entry.result === "win").length,
    [logs]
  );
  const losses = useMemo(
    () => logs.filter((entry) => entry.result === "loss").length,
    [logs]
  );
  const ties = useMemo(
    () => logs.filter((entry) => entry.result === "tie").length,
    [logs]
  );

  const progress = isComplete
    ? 100
    : Math.round(((currentRound - 1) / rounds) * 100);

  function resetRun() {
    setCurrentRound(1);
    setPlayerMove(null);
    setAiMove(null);
    setLastResult(null);
    setIsAnimating(false);
    setIsComplete(false);
    setShowPlayerBack(false);
    setShowAiBack(false);
    setShowPlayerFace(false);
    setShowAiFace(false);
    setLogs([]);
  }

  function clearRevealStateForNextRound() {
    setPlayerMove(null);
    setAiMove(null);
    setLastResult(null);
    setShowPlayerBack(false);
    setShowAiBack(false);
    setShowPlayerFace(false);
    setShowAiFace(false);
  }

  function play(move: Move) {
    if (isAnimating || isComplete) return;

    const ai = MOVES[Math.floor(Math.random() * MOVES.length)];
    const result = getResult(move, ai);
    const goldEarned = result === "win" ? birbPerRound : 0;

    setIsAnimating(true);
    setLastResult(null);
    setPlayerMove(move);
    setAiMove(ai);

    setShowPlayerBack(true);
    setShowAiBack(true);
    setShowPlayerFace(false);
    setShowAiFace(false);

    setTimeout(() => {
      setShowPlayerFace(true);
    }, 700);

    setTimeout(() => {
      setShowAiFace(true);
    }, 1300);

    setTimeout(() => {
      setLastResult(result);

      if (result !== "tie") {
        setLogs((prev) => [
          ...prev,
          {
            round: currentRound,
            player: move,
            ai,
            result,
            goldEarned,
          },
        ]);
      }
    }, 1750);

    setTimeout(() => {
      if (result === "tie") {
        clearRevealStateForNextRound();
        setIsAnimating(false);
        return;
      }

      if (currentRound >= rounds) {
        setIsComplete(true);
      } else {
        setCurrentRound((r) => r + 1);
        clearRevealStateForNextRound();
      }

      setIsAnimating(false);
    }, 2800);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "white",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundColor: "#000",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.82)), url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 20,
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.34)",
            backdropFilter: "blur(16px)",
            borderRadius: 34,
            padding: 22,
            boxShadow: "0 0 60px rgba(127,29,29,0.26)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img src="/logo.png" alt="birb" style={{ height: 44 }} />
              <div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.46)",
                    marginBottom: 5,
                  }}
                >
                  Prototype
                </div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>
                  Rock • Paper • Scissors — Compete for Juice
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  border: "1px solid rgba(16,185,129,0.22)",
                  background: "rgba(16,185,129,0.12)",
                  color: "#bbf7d0",
                  borderRadius: 999,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                SOL: Gxu7…m7rz
              </div>
              <button
                style={{
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  borderRadius: 999,
                  padding: "10px 16px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "1.3fr 0.7fr",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.34)",
              backdropFilter: "blur(16px)",
              borderRadius: 34,
              padding: 28,
              boxShadow: "0 0 60px rgba(127,29,29,0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  background: "#fde047",
                  color: "#000",
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                Lossless-style game
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Win = Gold / Lose = 0 Gold
              </div>
            </div>

            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 8,
              }}
            >
              Birb Game
            </div>

            <h1
              style={{
                fontSize: 58,
                lineHeight: 0.95,
                margin: 0,
                fontWeight: 950,
                letterSpacing: "-0.03em",
              }}
            >
              Play for Gold.
              <br />
              Compete for Juice.
            </h1>

            <p
              style={{
                marginTop: 16,
                maxWidth: 880,
                fontSize: 17,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Each round commits BIRB. If you win, that round converts into
              Gold. If you lose, you earn no Gold for that round. At the end,
              entries are refunded and Juice is distributed according to total
              Gold earned.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              <StatCard
                label="Available to play"
                value={`${formatNum(totalCommitted)} BIRB`}
                accent="0 0 50px rgba(239,68,68,0.16)"
              />
              <StatCard label="Gold earned" value={formatNum(gold)} />
              <StatCard
                label="Round"
                value={`${Math.min(currentRound, rounds)}/${rounds}`}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.34)",
              backdropFilter: "blur(16px)",
              borderRadius: 34,
              padding: 28,
              boxShadow: "0 0 60px rgba(127,29,29,0.22)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 10,
              }}
            >
              How it works
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                color: "rgba(255,255,255,0.76)",
                fontSize: 15,
              }}
            >
              <div>• Choose total rounds and BIRB per round.</div>
              <div>• Select Rock, Paper, or Scissors against AI.</div>
              <div>• Wins convert that round&apos;s BIRB into Gold.</div>
              <div>• Losses produce no Gold.</div>
              <div>• Ties replay and do not consume a round.</div>
              <div>• Entries refund at the end of the run.</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "0.78fr 1.34fr 0.78fr",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.34)",
              backdropFilter: "blur(16px)",
              borderRadius: 34,
              padding: 24,
              boxShadow: "0 0 60px rgba(127,29,29,0.22)",
              height: "fit-content",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 10,
              }}
            >
              Setup
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 22 }}>
              Game configuration
            </div>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{ marginBottom: 10, color: "rgba(255,255,255,0.65)" }}
              >
                Rounds
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {[3, 5, 10, 25, 50, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      !isAnimating && !isComplete && setRounds(value)
                    }
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      background:
                        rounds === value
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.3)",
                      color: "white",
                      borderRadius: 18,
                      padding: "12px 10px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{ marginBottom: 10, color: "rgba(255,255,255,0.65)" }}
              >
                BIRB per round
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                }}
              >
                {[10, 25, 50, 100, 250, 500].map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      !isAnimating && !isComplete && setBirbPerRound(value)
                    }
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      background:
                        birbPerRound === value
                          ? "rgba(253,224,71,0.14)"
                          : "rgba(0,0,0,0.3)",
                      color: "white",
                      borderRadius: 18,
                      padding: "12px 10px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.3)",
                borderRadius: 26,
                padding: 18,
                marginBottom: 18,
                color: "rgba(255,255,255,0.82)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.48)" }}>
                  Committed
                </span>
                <span>{formatNum(totalCommitted)} BIRB</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.48)" }}>
                  Refunded at end
                </span>
                <span>{formatNum(totalCommitted)} BIRB</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.48)" }}>
                  Gold on a win
                </span>
                <span>{formatNum(birbPerRound)} Gold</span>
              </div>
            </div>

            <button
              onClick={resetRun}
              style={{
                width: "100%",
                border: "none",
                background: "linear-gradient(90deg,#ef4444,#e11d48)",
                color: "white",
                borderRadius: 24,
                padding: "16px 18px",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Reset Run
            </button>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.34)",
              backdropFilter: "blur(16px)",
              borderRadius: 34,
              padding: 24,
              boxShadow: "0 0 60px rgba(127,29,29,0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 6,
                  }}
                >
                  Showdown
                </div>
                <div style={{ fontSize: 34, fontWeight: 900 }}>
                  Round {Math.min(currentRound, rounds)} / {rounds}
                </div>
              </div>

              <div style={{ minWidth: 240 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 8,
                  }}
                >
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg,#ef4444,#fb7185)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                marginBottom: 18,
              }}
            >
              <RevealPanel
                title="You"
                move={playerMove}
                showBack={showPlayerBack}
                showFace={showPlayerFace}
                pulse={isAnimating && !showPlayerFace}
              />
              <RevealPanel
                title="AI"
                move={aiMove}
                showBack={showAiBack}
                showFace={showAiFace}
                pulse={isAnimating && !showAiFace}
              />
            </div>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.28)",
                borderRadius: 28,
                padding: 20,
                textAlign: "center",
                marginBottom: 18,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {!showPlayerBack && !isComplete && (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    Choose your move
                  </div>
                  <div
                    style={{ marginTop: 8, color: "rgba(255,255,255,0.62)" }}
                  >
                    Beat the AI to convert this round&apos;s BIRB into Gold.
                  </div>
                </>
              )}

              {isAnimating && !showPlayerFace && (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    Cards locked in…
                  </div>
                  <div
                    style={{ marginTop: 8, color: "rgba(255,255,255,0.62)" }}
                  >
                    Reveal sequence starting.
                  </div>
                </>
              )}

              {isAnimating && showPlayerFace && !showAiFace && (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    Your reveal is in
                  </div>
                  <div
                    style={{ marginTop: 8, color: "rgba(255,255,255,0.62)" }}
                  >
                    Waiting on the AI reveal.
                  </div>
                </>
              )}

              {lastResult && !isAnimating && !isComplete && (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    {lastResult === "win"
                      ? "Round won"
                      : lastResult === "loss"
                      ? "Round lost"
                      : "Tie — replaying round"}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "10px 16px",
                        borderRadius: 999,
                        fontWeight: 900,
                        background:
                          lastResult === "win"
                            ? "#86efac"
                            : lastResult === "loss"
                            ? "#fda4af"
                            : "#fff",
                        color: "#000",
                      }}
                    >
                      {lastResult === "win"
                        ? `+${formatNum(birbPerRound)} Gold`
                        : "0 Gold"}
                    </span>
                  </div>
                </>
              )}

              {isComplete && (
                <>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    Run complete
                  </div>
                  <div
                    style={{ marginTop: 8, color: "rgba(255,255,255,0.62)" }}
                  >
                    Entries refund at completion. Gold determines Juice share.
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {MOVES.map((move) => (
                <ChoiceButton
                  key={move}
                  move={move}
                  disabled={isAnimating || isComplete}
                  onClick={() => play(move)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.34)",
                backdropFilter: "blur(16px)",
                borderRadius: 34,
                padding: 24,
                boxShadow: "0 0 60px rgba(127,29,29,0.22)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 14,
                }}
              >
                Live summary
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <StatCard label="Wins" value={String(wins)} />
                <StatCard label="Losses" value={String(losses)} />
                <StatCard label="Ties" value={String(ties)} />
              </div>

              <div
                style={{
                  border: "1px solid rgba(253,224,71,0.18)",
                  background: "rgba(253,224,71,0.08)",
                  borderRadius: 28,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(254,249,195,0.74)",
                    marginBottom: 6,
                  }}
                >
                  Gold earned
                </div>
                <div style={{ fontSize: 42, fontWeight: 950 }}>
                  {formatNum(gold)}
                </div>
                <div style={{ marginTop: 6, color: "rgba(255,255,255,0.62)" }}>
                  Only winning rounds convert BIRB into Gold.
                </div>
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.34)",
                backdropFilter: "blur(16px)",
                borderRadius: 34,
                padding: 24,
                boxShadow: "0 0 60px rgba(127,29,29,0.22)",
                maxHeight: 620,
                overflow: "auto",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 14,
                }}
              >
                Round log
              </div>

              {logs.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.45)" }}>
                  No resolved rounds played yet.
                </div>
              )}

              <div style={{ display: "grid", gap: 12 }}>
                {logs
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.round}
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(0,0,0,0.28)",
                        borderRadius: 24,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 900, fontSize: 18 }}>
                          Round {entry.round}
                        </div>
                        <div
                          style={{
                            borderRadius: 999,
                            padding: "8px 12px",
                            fontWeight: 900,
                            background:
                              entry.result === "win"
                                ? "#86efac"
                                : entry.result === "loss"
                                ? "#fda4af"
                                : "#fff",
                            color: "#000",
                            textTransform: "capitalize",
                          }}
                        >
                          {entry.result}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          color: "rgba(255,255,255,0.74)",
                        }}
                      >
                        You:{" "}
                        <span
                          style={{
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        >
                          {entry.player}
                        </span>
                        {" • "}
                        AI:{" "}
                        <span
                          style={{
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        >
                          {entry.ai}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          fontSize: 13,
                          color: "rgba(255,255,255,0.48)",
                        }}
                      >
                        <span>Committed: {formatNum(birbPerRound)} BIRB</span>
                        <span>Gold: {formatNum(entry.goldEarned)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
