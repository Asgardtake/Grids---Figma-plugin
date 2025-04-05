// Показваме UI интерфейса
figma.showUI(__html__, { width: 500, height: 660 });

// Слушаме съобщения от UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'execute-grid') {
    // 1. Създаване на нов Frame
    const frame = figma.createFrame();
    frame.name = "Assassins Grid Frame";

    // 2. Задаваме размерите на Frame-а
    frame.resize(msg.width, msg.height);

    // 3. Центрираме във viewport-а
    frame.x = figma.viewport.center.x - msg.width / 2;
    frame.y = figma.viewport.center.y - msg.height / 2;

    // 4. Създаваме Grid layout
    frame.layoutGrids = [{
      pattern: "COLUMNS",
      alignment: msg.type.toLowerCase(), // CENTER, MIN, MAX -> center, min, max
      count: msg.count,
      gutterSize: msg.gutter,
      sectionSize: msg.columnWidth,
      offset: 0,
      visible: true,
      color: { r: 1, g: 0, b: 0 }, // червено (FF0000)
      opacity: msg.opacity
    }];

    // 5. Добавяме го в текущата страница и го показваме
    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    // 6. Нотификация
    figma.notify("✅ Grid frame created successfully!");
  }
};
