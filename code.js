figma.showUI(__html__, { width: 500, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'execute-grid') {
    const {
      width,
      height,
      count,
      columnWidth,
      gutter,
      type,
      opacity,
      frameName
    } = msg;

    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.name = frameName;
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

    // ✅ Превръщаме frame в Auto Layout хоризонтално
    frame.layoutMode = "HORIZONTAL";
    frame.primaryAxisAlignItems = "CENTER"; // Центриране по хоризонтала
    frame.counterAxisAlignItems = "MIN"; // Горен край по вертикала
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";

    const gridGroup = figma.createFrame();
    gridGroup.name = "Grid Columns";
    gridGroup.layoutMode = "HORIZONTAL";
    gridGroup.primaryAxisSizingMode = "FIXED";
    gridGroup.counterAxisSizingMode = "FIXED";
    gridGroup.itemSpacing = gutter;
    gridGroup.paddingLeft = 0;
    gridGroup.paddingRight = 0;
    gridGroup.paddingTop = 0;
    gridGroup.paddingBottom = 0;
    gridGroup.fills = [];
    gridGroup.clipsContent = false;

    gridGroup.layoutAlign = "CENTER";

    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle();
      rect.resize(columnWidth, height);
      rect.fills = [{
        type: "SOLID",
        color: { r: 1, g: 0, b: 0 },
        opacity: opacity
      }];
      rect.name = `Column ${i + 1}`;
      gridGroup.appendChild(rect);
    }

    const totalWidth = (columnWidth * count) + (gutter * (count - 1));
    gridGroup.resize(totalWidth, height);
    gridGroup.locked = true;


    frame.appendChild(gridGroup);
    figma.currentPage.appendChild(frame);

    // 🧠 НОВО: позициониране така, че да не застъпва други обекти
    const nodes = figma.currentPage.children;
    let maxY = 0;
    let foundObjects = false;

    for (const node of nodes) {
      if (node.type !== "FRAME" && node.type !== "GROUP" && node.type !== "INSTANCE" && node.type !== "COMPONENT") continue;
      const bottomY = node.y + node.height;
      if (bottomY > maxY) {
        maxY = bottomY;
        foundObjects = true;
      }
    }

    // Ако има други обекти – позиционираме под тях
    if (foundObjects) {
      frame.x = 0;
      frame.y = maxY + 100; // малко отстояние
    } else {
      // Ако няма обекти, позиционираме центрирано
      frame.x = figma.viewport.center.x - width / 2;
      frame.y = figma.viewport.center.y - height / 2;
    }

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify("✅ Grid успешно създаден!");

    // ✅ Връщаме плъгина към началния екран
    figma.ui.postMessage({ type: 'reset-ui' });
  }
};