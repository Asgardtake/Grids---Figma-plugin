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

    frame.layoutMode = "HORIZONTAL";
    frame.primaryAxisAlignItems = "CENTER";
    frame.counterAxisAlignItems = "MIN";
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

    const totalGridWidth = columnWidth * count + gutter * (count - 1);
    const remainingSpace = (width - totalGridWidth) / 2;
    const extraPerSide = Math.floor((remainingSpace + gutter) / (columnWidth + gutter));
    const totalExtra = extraPerSide * 2;

    // 👉 Създаваме сини колони вляво
    for (let i = 0; i < extraPerSide; i++) {
      const blueLeft = figma.createRectangle();
      blueLeft.resize(columnWidth, height);
      blueLeft.fills = [{
        type: "SOLID",
        color: { r: 0, g: 0.4, b: 1 }, // син цвят
        opacity: opacity
      }];
      blueLeft.name = `Blue Left ${i + 1}`;
      gridGroup.appendChild(blueLeft);
    }

    // 👉 Създаваме червени колони (основен grid)
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

    // 👉 Създаваме сини колони вдясно
    for (let i = 0; i < extraPerSide; i++) {
      const blueRight = figma.createRectangle();
      blueRight.resize(columnWidth, height);
      blueRight.fills = [{
        type: "SOLID",
        color: { r: 0, g: 0.4, b: 1 },
        opacity: opacity
      }];
      blueRight.name = `Blue Right ${i + 1}`;
      gridGroup.appendChild(blueRight);
    }

    const totalGroupWidth = (columnWidth * (count + totalExtra)) + (gutter * (count + totalExtra - 1));
    gridGroup.resize(totalGroupWidth, height);
    gridGroup.locked = true;

    frame.appendChild(gridGroup);
    figma.currentPage.appendChild(frame);

    // 👉 Позициониране под други обекти
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

    if (foundObjects) {
      frame.x = 0;
      frame.y = maxY + 100;
    } else {
      frame.x = figma.viewport.center.x - width / 2;
      frame.y = figma.viewport.center.y - height / 2;
    }

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify("✅ Grid успешно създаден със stretch колони!");

    figma.ui.postMessage({ type: 'reset-ui' });
  }
};
