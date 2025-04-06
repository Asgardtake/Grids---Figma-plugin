figma.showUI(__html__, { width: 500, height: 660 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'execute-grid') {
    const {
      width,
      height,
      count,
      columnWidth,
      gutter,
      type,
      opacity
    } = msg;

    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.name = "Assassins Grid Frame";
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

    frame.appendChild(gridGroup);
    figma.currentPage.appendChild(frame);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify("✅ Grid успешно създаден!");
    figma.closePlugin();
  }
};
