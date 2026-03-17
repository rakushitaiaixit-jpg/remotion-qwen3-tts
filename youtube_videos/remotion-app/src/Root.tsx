import "./index.css";
import { Composition, getInputProps } from "remotion";
import { MyComposition } from "./Composition";

// 外部からのパラメーターを取得（デフォルトは横長）
const inputProps = getInputProps();
const videoWidth = (inputProps.width as number) || 1920;
const videoHeight = (inputProps.height as number) || 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={1260}
        fps={30}
        width={videoWidth}
        height={videoHeight}
        defaultProps={inputProps}
      />
    </>
  );
};
