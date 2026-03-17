import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, Img } from "remotion";
import speechData from "./speech.json";
import scenesData from "./scenes.json";
// speech.wav as imported asset
import audioSrc from "./speech.wav";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Find the current subtitle based on the frame
  const currentSubtitle = speechData.find(
    (item) => frame >= (item.startMs / 1000) * fps && frame < (item.endMs / 1000) * fps
  );

  // Find current scene based on frame
  const currentScene = scenesData.find(
    (item) => frame >= (item.startMs / 1000) * fps && frame < (item.endMs / 1000) * fps
  );

  // Background smooth color shifting
  const bgHue = interpolate(frame, [0, fps * 42], [220, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const backgroundColor = `hsl(${bgHue}, 15%, 8%)`;

  // Abstract shapes animation
  const rotateShape1 = interpolate(frame, [0, fps * 42], [0, 360]);
  const rotateShape2 = interpolate(frame, [0, fps * 42], [360, 0]);

  // Entrance animation for subtitle
  const subtitleScale = currentSubtitle
    ? spring({
        fps,
        frame: frame - (currentSubtitle.startMs / 1000) * fps,
        config: { damping: 15, mass: 0.8 },
      })
    : 0;
    
  const subtitleY = currentSubtitle
    ? interpolate(
        spring({
          fps,
          frame: frame - (currentSubtitle.startMs / 1000) * fps,
          config: { damping: 16 },
        }),
        [0, 1],
        [80, 0]
      )
    : 80;

  // Render visual element based on scene
  const renderVisuals = () => {
    if (!currentScene) return null;
    
    // Scene local logic
    const sceneStartFrame = (currentScene.startMs / 1000) * fps;
    const sceneLocalFrame = frame - sceneStartFrame;
    
    // Scene transition (fade in)
    const sceneOpacity = interpolate(sceneLocalFrame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    // We can show dynamic visuals based on the scene 'type'
    const scaleAnim = spring({ fps, frame: sceneLocalFrame, config: { damping: 12 } });

    if (currentScene.type === "intro") {
      return (
        <div style={{ opacity: sceneOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 280, height: 180, 
            background: "linear-gradient(135deg, rgba(33,150,243,0.8), rgba(33,150,243,0.2))",
            borderRadius: 30,
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", justifyContent: "center", alignItems: "center",
            transform: `scale(${scaleAnim}) rotate(2deg)`,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(33,150,243,0.3)"
          }}>
             <div style={{ width: 140, height: 40, background: "rgba(255,255,255,0.8)", borderRadius: 10, alignSelf:"flex-end", marginBottom: 20 }}></div>
          </div>
          <h2 style={{ color: "#fff", fontSize: 50, fontWeight: 800, marginTop: 40, letterSpacing: 2 }}>
            <span style={{ color: currentScene.themeColor }}>Typeless</span> Keyboard
          </h2>
        </div>
      );
    }
    
    if (currentScene.type === "feature") {
      // Mocking LINE vs Typeless transition
      const switchProgress = spring({ fps, frame: Math.max(0, sceneLocalFrame - 60), config: { damping: 14 } });
      const xOffset = interpolate(switchProgress, [0, 1], [0, -300]);
      
      return (
        <div style={{ opacity: sceneOpacity, display: "flex", flexDirection: "row", alignItems: "center", gap: 60, transform: `translateX(${xOffset}px)` }}>
           <div style={{
             width: 320, height: 400, background: "#111", borderRadius: 40, border: "4px solid #333",
             display: "flex", flexDirection: "column", padding: 20,
             opacity: interpolate(switchProgress, [0, 0.5], [1, 0.3])
           }}>
              <div style={{ flex: 1 }}></div>
              <div style={{ height: 160, background: "#222", borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", color: "#666", fontSize: 24 }}>Normal Keyboard</div>
           </div>
           
           <div style={{
             width: 320, height: 400, background: "linear-gradient(180deg, #111 0%, #0a2010 100%)", borderRadius: 40, border: `4px solid ${currentScene.themeColor}`,
             display: "flex", flexDirection: "column", padding: 20,
             transform: `scale(${interpolate(switchProgress, [0, 1], [0.8, 1.1])})`,
             boxShadow: `0 0 50px ${currentScene.themeColor}40`
           }}>
              <div style={{ flex: 1 }}></div>
              <div style={{ height: 160, background: `linear-gradient(135deg, ${currentScene.themeColor}, #2E7D32)`, borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontSize: 48 }}>
                 🎙️
              </div>
           </div>
        </div>
      );
    }
    
    if (currentScene.type === "benefit") {
      return (
        <div style={{ opacity: sceneOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 160, transform: `scale(${scaleAnim})` }}>✨</div>
          <h2 style={{ color: "#fff", fontSize: 60, fontWeight: 800, marginTop: 40 }}>
             Context Switching: <span style={{ color: currentScene.themeColor }}>Zero</span>
          </h2>
        </div>
      );
    }
    
    if (currentScene.type === "conclusion") {
      return (
        <div style={{ opacity: sceneOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
             width: 300, height: 300, borderRadius: 150, 
             background: `linear-gradient(to right, ${currentScene.themeColor}, #E91E63)`,
             display: "flex", justifyContent: "center", alignItems: "center",
             transform: `scale(${scaleAnim})`,
             boxShadow: `0 0 80px ${currentScene.themeColor}`
          }}>
             <div style={{ fontSize: 120 }}>🚀</div>
          </div>
          <h2 style={{ color: "#fff", fontSize: 70, fontWeight: 900, marginTop: 60 }}>
             Overwhelmingly Fast.
          </h2>
        </div>
      );
    }

    return null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      {/* Abstract Background Elements */}
      <div style={{
          position: "absolute", top: "-10%", left: "-10%", width: "60%", height: "60%",
          background: "radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(0,0,0,0) 70%)",
          transform: `rotate(${rotateShape1}deg)`
      }} />
      <div style={{
          position: "absolute", bottom: "-20%", right: "-10%", width: "80%", height: "80%",
          background: `radial-gradient(circle, ${currentScene ? currentScene.themeColor : '#2196F3'}20 0%, rgba(0,0,0,0) 70%)`,
          transform: `rotate(${rotateShape2}deg)`,
          transition: "background 1s ease"
      }} />

      <Audio src={audioSrc} />

      {/* Main Content Area */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "70%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {renderVisuals()}
      </div>

      {/* Subtitles Area */}
      <div style={{
        position: "absolute",
        bottom: "8%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 100px",
        boxSizing: "border-box"
      }}>
        {currentSubtitle && (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              padding: "30px 60px",
              borderRadius: 30,
              border: "2px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              transform: `scale(${subtitleScale}) translateY(${subtitleY}px)`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              maxWidth: "90%",
              textAlign: "center"
            }}
          >
            <h1 style={{
              margin: 0,
              fontSize: 52,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.4,
              textShadow: "0 2px 10px rgba(0,0,0,0.8)"
            }}>
              {currentSubtitle.text}
            </h1>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div style={{
         position: "absolute", bottom: 0, left: 0, height: 10, 
         width: `${(frame / (fps * 42)) * 100}%`,
         background: `linear-gradient(90deg, #2196F3, ${currentScene ? currentScene.themeColor : '#E91E63'})`,
         transition: "background 0.5s ease"
      }} />
    </AbsoluteFill>
  );
};
