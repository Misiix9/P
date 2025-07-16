// Window Manager Utility
// Handles open, close, minimize, maximize, stacking/z-index for app windows

export const initialWindows = [];

export function windowReducer(state, action) {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      // If already open, bring to front
      const exists = state.find(w => w.id === action.payload.id);
      if (exists) {
        return state.map(w =>
          w.id === action.payload.id
            ? { ...w, minimized: false, z: Math.max(...state.map(x => x.z)) + 1 }
            : w
        );
      }
      // Open new window
      return [
        ...state,
        {
          ...action.payload,
          minimized: false,
          maximized: false,
          z: state.length ? Math.max(...state.map(x => x.z)) + 1 : 1,
        },
      ];
    }
    case 'CLOSE_WINDOW':
      return state.filter(w => w.id !== action.payload.id);
    case 'MINIMIZE_WINDOW':
      return state.map(w =>
        w.id === action.payload.id
          ? { ...w, minimized: action.payload.minimized !== undefined ? action.payload.minimized : !w.minimized }
          : w
      );
    case 'MAXIMIZE_WINDOW':
      return state.map(w =>
        w.id === action.payload.id ? { ...w, maximized: !w.maximized, minimized: false } : w
      );
    case 'FOCUS_WINDOW':
      return state.map(w =>
        w.id === action.payload.id
          ? { ...w, z: Math.max(...state.map(x => x.z)) + 1 }
          : w
      );
    default:
      return state;
  }
} 