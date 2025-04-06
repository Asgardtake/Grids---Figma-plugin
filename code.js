// Показваме UI интерфейса с фиксиран размер
figma.showUI(__html__, { width: 500, height: 660 });

// Основен listener за съобщения от UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'execute-grid') {
    console.log("🚀 Създаваме нов Frame и прилагаме Grid...");
    console.log("Получени grid параметри:", msg);

    const frame = figma.createFrame();
    frame.resize(msg.width, msg.height);
    frame.name = "Assassins Grid Frame";

    frame.x = figma.viewport.center.x - msg.width / 2;
    frame.y = figma.viewport.center.y - msg.height / 2;

    frame.layoutGrids = [{
      pattern: "COLUMNS",
      sectionSize: msg.columnWidth,
      gutterSize: msg.gutter,
      count: msg.count,
      alignment: msg.alignment,
      color: { r: 1, g: 0, b: 0 },
      visible: true,
      opacity: msg.opacity,
      offset: 0
    }];

    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    figma.notify("✅ Grid успешно създаден!");
    figma.closePlugin();
  }
};
