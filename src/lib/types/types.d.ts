interface InitOptions {
  isDataSent: boolean;
  isPositionDataSent: boolean;
  isMotionDataSent: boolean;
};

interface Pose {
  x: number;
  y: number;
  orientation: number;
};

type MessageType = "position" | "motionStart" | "motionEnd" | "message"

export type { InitOptions, Pose, MessageType }
