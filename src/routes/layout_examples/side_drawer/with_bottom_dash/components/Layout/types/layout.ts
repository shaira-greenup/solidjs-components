export interface LayoutState {
  drawer: {
    width: number;
    visible: boolean;
    isResizing: boolean;
    startX: number;
    startWidth: number;
  };
  topBar: {
    visible: boolean;
  };
  bottomDash: {
    visible: boolean;
  };
}
