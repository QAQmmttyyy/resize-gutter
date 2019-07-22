import "./styles.css";

const panelElems = Array.from(document.getElementsByClassName("panel-h"));
const defaultHeightStyle = `height: calc(${(1 / panelElems.length) *
  100}% - 0.5px);`;

panelElems.forEach(panelElem => {
  panelElem.style = `${defaultHeightStyle} min-height: 15%;`;
});

// drag
let curGutterElem = null;
let y = 0;
let prevSiblingHeight = 0;
let nextSiblingHeight = 0;
let totalHeightOfTwoSibling = 0;
let editorHeight = 0;

const gutterElems = Array.from(document.getElementsByClassName("gutter-v"));

// console.log(gutterElems);

let mDownHandler = ev => {
  y = ev.clientY;
  curGutterElem = ev.target;

  // curGutterElem.style.cursor = "row-resize";

  editorHeight = curGutterElem.parentElement.clientHeight;

  let initHeight1 = parseFloat(
    curGutterElem.previousElementSibling.style.height.match(/^calc\((.*)%/)[1]
  );

  let initHeight2 = parseFloat(
    curGutterElem.nextElementSibling.style.height.match(/^calc\((.*)%/)[1]
  );

  prevSiblingHeight = initHeight1;
  nextSiblingHeight = initHeight2;
  totalHeightOfTwoSibling = initHeight1 + initHeight2;

  // console.log(
  //   "down",
  //   y,
  //   prevSiblingHeight,
  //   nextSiblingHeight,
  //   totalHeightOfTwoSibling
  // );

  document.onmousemove = mMoveHandler;
  document.onmouseup = mUpHandler;
};

let mMoveHandler = ev => {
  // curGutterElem.style.cursor = "row-resize";

  let clientY = ev.clientY;

  let deltaY = parseFloat((((clientY - y) / editorHeight) * 100).toFixed(4));

  // 只有 prev 或 next 大于最小值才进行变化
  if (deltaY < 0) {
    nextSiblingHeight -= deltaY;

    if (nextSiblingHeight >= 15) {
      prevSiblingHeight += deltaY;
      nextSiblingHeight =
        prevSiblingHeight < 15
          ? totalHeightOfTwoSibling - 15
          : totalHeightOfTwoSibling - prevSiblingHeight;
    }
  } else {
    prevSiblingHeight += deltaY;

    if (prevSiblingHeight >= 15) {
      nextSiblingHeight -= deltaY;
      prevSiblingHeight =
        nextSiblingHeight < 15
          ? totalHeightOfTwoSibling - 15
          : totalHeightOfTwoSibling - nextSiblingHeight;
    }
  }

  // prevSiblingHeight += deltaY;
  // nextSiblingHeight -= deltaY;

  // console.log(prevSiblingHeight, nextSiblingHeight);

  curGutterElem.previousElementSibling.style.height = `calc(${
    prevSiblingHeight < 15 ? 15 : prevSiblingHeight
  }% - 0.5px)`;
  curGutterElem.nextElementSibling.style.height = `calc(${
    nextSiblingHeight < 15 ? 15 : nextSiblingHeight
  }% - 0.5px)`;

  y = clientY;
};

let mUpHandler = ev => {
  y = 0;
  curGutterElem = null;
  prevSiblingHeight = 0;
  nextSiblingHeight = 0;
  totalHeightOfTwoSibling = 0;

  document.onmousemove = null;
  document.onmouseup = null;
};

gutterElems.forEach(gutterElem => {
  gutterElem.onmousedown = mDownHandler;
});
