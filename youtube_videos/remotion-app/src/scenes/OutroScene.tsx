import { spring, interpolate, useVideoConfig } from "remotion";

type Props = {
    title: string;
    subtitle?: string;
    localFrame: number;
};

export const OutroScene: React.FC<Props> = ({ title, subtitle, localFrame }) => {
    const { fps } = useVideoConfig();
    const up = spring({ frame: localFrame, fps, config: { damping: 14 } });

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", background: "linear-gradient(135deg, #11998e, #38ef7d)" }}>
            <h1 style={{ color: "#fff", fontSize: 80, textShadow: "0 4px 20px rgba(0,0,0,0.3)", transform: `translateY(${interpolate(up, [0, 1], [50, 0])}px)`, opacity: up, margin: 0 }}>{title}</h1>
            {subtitle && (
                <h2 style={{ color: "#fff", fontSize: 60, marginTop: 40, transform: `translateY(${interpolate(up, [0, 1], [50, 0])}px)`, opacity: up, padding: "20px 40px", background: "rgba(255,255,255,0.2)", borderRadius: 30 }}>{subtitle}</h2>
            )}
        </div>
    );
};
