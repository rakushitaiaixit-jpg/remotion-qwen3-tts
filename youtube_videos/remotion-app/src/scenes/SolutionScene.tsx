import { spring, interpolate, useVideoConfig } from "remotion";

type Props = {
    title: string;
    codeLines?: string[];
    localFrame: number;
};

export const SolutionScene: React.FC<Props> = ({ title, codeLines, localFrame }) => {
    const { fps } = useVideoConfig();
    const pop = spring({ frame: localFrame, fps, config: { damping: 12, mass: 0.5, stiffness: 200 } });
    const up = spring({ frame: Math.max(0, localFrame - 15), fps, config: { damping: 15 } });

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", background: "linear-gradient(135deg, #f12711, #f5af19)" }}>
            <h1 style={{ color: "#fff", fontSize: 90, transform: `scale(${pop})`, textShadow: "0 4px 20px rgba(0,0,0,0.3)", margin: 0 }}>{title}</h1>
            {codeLines && (
                <div style={{ marginTop: 50, background: "#282c34", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", transform: `translateY(${interpolate(up, [0, 1], [100, 0])}px)`, opacity: up, width: "70%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 25 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#ff5f56" }} />
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#ffbd2e" }} />
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#27c93f" }} />
                    </div>
                    <code style={{ color: "#abb2bf", fontSize: 36, lineHeight: 1.6, display: "block", whiteSpace: "pre" }}>
                        {codeLines.join("\n")}
                    </code>
                </div>
            )}
        </div>
    );
};
