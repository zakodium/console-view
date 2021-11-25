import { produce } from 'immer';
import { createContext, useContext, useReducer } from 'react';

import { useWs } from './ws';

const viewContext = createContext();

const viewReducer = produce(function viewReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      state.elements = [];
      break;
    case 'ADD':
      state.elements.push(action.payload);
      break;
    default:
      throw new Error(`unknown action: ${action.type}`);
  }
  return state;
});

const initialState = {
  elements: [],
};

export function useView() {
  return useContext(viewContext);
}

export function ViewProvider(props) {
  const [state, dispatch] = useReducer(viewReducer, initialState);
  useWs(dispatch);

  return (
    <viewContext.Provider value={state}>{props.children}</viewContext.Provider>
  );
}
