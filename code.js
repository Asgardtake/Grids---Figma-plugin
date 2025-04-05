// Показваме UI интерфейса с фиксиран размер
figma.showUI(__html__, { width: 500, height: 660 });

// Изпращаме начално съобщение към UI (ако е нужно)
figma.ui.postMessage({ type: "loadInitialScreen" });

// Основен listener за съобщения от UI
figma.ui.onmessage = async (msg) => {
  // Потвърждение, че UI е готово
  if (msg.type === "ready") {
    console.log("✅ UI е готово.");
  }

  // Смяна на екран по заявка
  if (msg.type === "switchScreen") {
    console.log("➡️ Смяна на екран");
    figma.ui.postMessage({ type: "loadNewScreen" });
  }

  // Изпълнение на крайна стъпка – създаване на Frame + Grid
  if (msg.type === 'execute-grid') {
    console.log("🚀 Създаваме нов Frame и прилагаме Grid...");

    // 1. Създаваме нов Frame

    console.log("Получени grid параметри:", msg);

    const frame = figma.createFrame();
    frame.resize(msg.width, msg.height);
    frame.name = "Assassins Grid Frame";

    // 2. Центрираме го в изгледа
    frame.x = figma.viewport.center.x - msg.width / 2;
    frame.y = figma.viewport.center.y - msg.height / 2;

    // 3. Прилагаме Grid с параметри
    frame.layoutGrids = [{
      pattern: "COLUMNS",
      sectionSize: msg.columnWidth,
      gutterSize: msg.gutter,
      count: msg.count,
      alignment: msg.alignment, // <- ВАЖНО!
      color: { r: 1, g: 0, b: 0 },
      visible: true,
      opacity: msg.opacity,
      offset: 0
    }];
    

    // 4. Добавяме го в страницата и го центрираме в изгледа
    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    // 5. Известие и затваряне
    figma.notify("✅ Grid успешно създаден!");
    figma.closePlugin();
  }

  // Обработка на прогрес
  if (msg.type === "setProgress") {
    console.log("📶 Прогрес: ", msg.step);
    figma.ui.postMessage({ type: "setProgress", step: msg.step });
  }

  // Презареждане на началния екран
  if (msg.type === "loadInitialScreen") {
    figma.ui.postMessage({ type: "loadInitialScreen" });
  }
};
