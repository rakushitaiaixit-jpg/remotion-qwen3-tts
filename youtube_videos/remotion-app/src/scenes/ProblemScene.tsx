import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
    title: string;
    items?: string[];
    localFrame: number;
};

export const ProblemScene: React.FC<Props> = ({ title, items, localFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const shake = Math.sin(frame / 5) * 5;
    const op = spring({ frame: localFrame, fps, config: { damping: 15 } });

    const positions = [
        { top: "10%", left: "5%", rotate: "-10deg" },
        { top: "40%", right: "10%", rotate: "8deg" },
    ];

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", background: "linear-gradient(135deg, #23074d, #cc5333)" }}>
            <h1 style={{ color: "#fff", fontSize: 80, transform: `translateY(${shake}px)`, opacity: op, textShadow: "0 4px 20px rgba(0,0,0,0.8)", borderBottom: "5px solid #ff4b2b", paddingBottom: 20, margin: 0 }}>{title}</h1>
            {items && (
                <div style={{ position: "relative", width: "80%", height: "350px", marginTop: 40, opacity: op }}>
                    {items.slice(0, 2).map((item, i) => (
                        <div key={i} style={{ position: "absolute", ...(positions[i] as React.CSSProperties), fontSize: 40, color: i === 0 ? "#ffcccc" : "#ffddcc", transform: `rotate(${positions[i].rotate})` }}>{item}</div>
                    ))}
                    {items[2] && (
                        <div style={{ position: "absolute", bottom: "15%", left: "20%", fontSize: 50, color: "#fff", transform: `scale(${1 + Math.sin(frame / 10) * 0.05})`, background: "rgba(0,0,0,0.5)", padding: "20px 30px", borderRadius: 15, border: "2px solid #ff4b2b" }}>{items[2]}</div>
                    )}
                </div>
            )}
        </div>
    );
};
