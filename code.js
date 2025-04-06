// Показваме UI интерфейса с фиксиран размер
figma.showUI(__html__, { width: 500, height: 660 });

// Основен listener за съобщения от UI
figma.ui.onmessage = async (msg) => {
  // Създаване на Frame и прилагане на Grid
  if (msg.type === 'execute-grid') {
    console.log("🚀 Създаваме нов Frame и прилагаме Grid...");
    console.log("Получени параметри:", msg);

    const frame = figma.createFrame();
    frame.resize(msg.width, msg.height);
    frame.name = "Assassins Grid Frame";

    // Центрираме го
    frame.x = figma.viewport.center.x - msg.width / 2;
    frame.y = figma.viewport.center.y - msg.height / 2;

    // Прилагане на layout grid
    frame.layoutGrids = [{
      pattern: "COLUMNS",
      sectionSize: msg.columnWidth,
      gutterSize: msg.gutter,
      count: msg.count,
      alignment: msg.alignment.toUpperCase(), // ← ТУК Е ФИКСЪТ
      color: { r: 1, g: 0, b: 0 }, // #FF0000
      opacity: msg.opacity,
      visible: true,
      offset: 0
    }];

    // Добавяме го към страницата и центрираме изгледа
    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    // Финално съобщение и затваряне
    figma.notify("✅ Grid успешно създаден!");
    figma.closePlugin();
  }
};
