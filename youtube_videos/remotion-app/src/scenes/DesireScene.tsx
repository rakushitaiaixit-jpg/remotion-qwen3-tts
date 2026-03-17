import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
    title: string;
    items?: string[];
    localFrame: number;
};

export const DesireScene: React.FC<Props> = ({ title, items, localFrame }) => {
    const { fps } = useVideoConfig();
    const scale = spring({ frame: localFrame, fps, config: { damping: 10 } });

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}>
            <h1 style={{ color: "#fff", fontSize: 90, textShadow: "0 4px 20px rgba(0,0,0,0.3)", transform: `scale(${scale})`, margin: 0 }}>{title}</h1>
            {items && (
                <div style={{ display: "flex", gap: 40, marginTop: 40, opacity: scale }}>
                    {items.map((item, i) => (
                        <span key={i} style={{ background: "rgba(255,255,255,0.2)", padding: "20px 40px", borderRadius: 20, fontSize: 40, color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>{item}</span>
                    ))}
                </div>
            )}
        </div>
    );
};
