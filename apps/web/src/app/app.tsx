import React, { useEffect, useState, useRef } from 'react';
import localforage from 'localforage';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitBoard, PlaitElement, Viewport, PlaitTheme } from '@plait/core';
import { DrawingsDrawer, DrawingsDrawerProvider, useDrawingsDrawer } from '@drawnix/drawnix';

const MAIN_BOARD_CONTENT_KEY = 'main_board_content';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

function AppContent() {
  const [value, setValue] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>({ children: [] });
  
  const { isOpen, closeDrawer } = useDrawingsDrawer();
  const boardRef = useRef<PlaitBoard | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await localforage.getItem(MAIN_BOARD_CONTENT_KEY);
      if (storedData) {
        setValue(storedData as any);
        return;
      }
      setValue({ children: [] });
    };

    loadData();
  }, []);
  return (
    <>
      <Drawnix
        value={value.children}
        viewport={value.viewport}
        theme={value.theme}
        onChange={(boardData) => {
          if (boardData && typeof boardData === 'object' && 'children' in boardData) {
            localforage.setItem(MAIN_BOARD_CONTENT_KEY, boardData);
            setValue(boardData);
          }
        }}
        afterInit={(board) => {
          boardRef.current = board;
          /*
          console.log(
            `add __drawnix__web__debug_log to window, so you can call add log anywhere, like: window.__drawnix__web__console('some thing')`
          );
          (window as any)['__drawnix__web__console'] = (value: string) => {
            addDebugLog(board, value);
          };
          */
        }}
      />
      {boardRef.current && (
        <DrawingsDrawer isOpen={isOpen} onClose={closeDrawer} board={boardRef.current} />
      )}
    </>
  );
}

export function App() {
  return (
    <DrawingsDrawerProvider>
      <AppContent />
    </DrawingsDrawerProvider>
  );
}

const addDebugLog = (board: PlaitBoard, value: string) => {
  const container = PlaitBoard.getBoardContainer(board).closest(
    '.drawnix'
  ) as HTMLElement;
  let consoleContainer = container.querySelector('.drawnix-console');
  if (!consoleContainer) {
    consoleContainer = document.createElement('div');
    consoleContainer.classList.add('drawnix-console');
    container.append(consoleContainer);
  }
  const div = document.createElement('div');
  div.innerHTML = value;
  consoleContainer.append(div);
};

export default App;
