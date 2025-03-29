


// ✅ Показваме UI интерфейса
figma.showUI(__html__, { width: 500, height: 660 });

// ✅ Изпращаме начално съобщение към UI
figma.ui.postMessage({ type: "loadInitialScreen" });

// ✅ Слушаме съобщения от UI
figma.ui.onmessage = (msg) => {
  if (msg.type === "ready") {
    console.log("✅ UI е готово.");
  }

  if (msg.type === "switchScreen") {
    console.log("➡️ Получено: смяна на екран");
    figma.ui.postMessage({ type: "loadNewScreen" });
  }

  if (msg.type === "executeFinal") {
    console.log("🚀 Стартираме създаване на проекта...");
    // Тук можеш да добавиш логика за създаване на фрейм/грид и т.н.
    figma.notify("✅ Проектът е създаден успешно!");
    figma.closePlugin();
  }

  if (msg.type === "setProgress") {
    console.log("📶 Прогрес стъпка: ", msg.step);
    figma.ui.postMessage({ type: "setProgress", step: msg.step });
  }

  if (msg.type === "loadInitialScreen") {
    figma.ui.postMessage({ type: "loadInitialScreen" });
  }
};
