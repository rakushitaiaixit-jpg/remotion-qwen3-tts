import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type Props = {
    title: string;
    subtitle?: string;
};

export const IntroScene: React.FC<Props> = ({ title, subtitle }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const anim = spring({ frame, fps, config: { damping: 12 } });
    const y = interpolate(anim, [0, 1], [50, 0]);

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", background: "linear-gradient(135deg, #1A2980, #26D0CE)" }}>
            <h1 style={{ color: "#fff", fontSize: 80, textShadow: "0 4px 20px rgba(0,0,0,0.5)", transform: `translateY(${y}px)`, opacity: anim, margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ color: "#eee", fontSize: 50, transform: `translateY(${y}px)`, opacity: anim, marginTop: 20 }}>{subtitle}</p>}
        </div>
    );
};
