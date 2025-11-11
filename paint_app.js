const canvas = document.querySelector(".can");
const tools = document.querySelectorAll(".option");
const fill = document.querySelector("#fill");
const colour = document.querySelectorAll(".colour .optionss");
const ctx = canvas.getContext("2d");
const clearCanvasBtn = document.querySelector(".clear");
const saveImageBtn = document.querySelector(".save");

let presentMouseX, presentMouseY, st;
let brushWidth = 5;
let isDrawing = false;
let active = [];
let active_ = [];
let selectedColor = "black";
let previousColor = selectedColor;
const colorPickerInput = document.querySelector("#color-picker input[type='color']");
const colorPickerParent = document.getElementById("color-picker");

const activeFilter =
  "invert(40%) sepia(50%) saturate(1000%) hue-rotate(180deg) brightness(100%) contrast(100%)";

const drawRect = (e) => {
  if(!fill.checked){
    return ctx.strokeRect(
    presentMouseX,
    presentMouseY,
    e.offsetX - presentMouseX,
    e.offsetY - presentMouseY
  );
  }
  ctx.fillRect(
    presentMouseX,
    presentMouseY,
    e.offsetX - presentMouseX,
    e.offsetY - presentMouseY
  );
  
};
const drawCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(e.offsetX - presentMouseX, 2) +
      Math.pow(e.offsetY - presentMouseY, 2)
  );
  ctx.arc(presentMouseX, presentMouseY, radius, 0, 2 * Math.PI);
  fill.checked ? ctx.fill() : ctx.stroke();
}
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(presentMouseX, presentMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(
    presentMouseX * 2 - e.offsetX,
    e.offsetY
  );
  ctx.closePath();
  fill.checked ? ctx.fill() : ctx.stroke();
}
const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(presentMouseX, presentMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  fill.checked ? ctx.fill() : ctx.stroke();
}
drawSquare = (e) => {
  const side = Math.min(
    Math.abs(e.offsetX - presentMouseX),
    Math.abs(e.offsetY - presentMouseY)
  );
  const width = e.offsetX > presentMouseX ? side : -side;
  const height = e.offsetY > presentMouseY ? side : -side;

  if(!fill.checked){
    return ctx.strokeRect(presentMouseX, presentMouseY, width, height);
  }
  ctx.fillRect(presentMouseX, presentMouseY, width, height);
}


window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const sizeSlider = document.getElementById("size");
  const sizeOutput = document.getElementById("ran");
  brushWidth = parseInt(sizeSlider.value);
  sizeOutput.textContent = `Size: ${brushWidth}px`;

  sizeSlider.addEventListener("input", (e) => {
    const newSize = parseInt(e.target.value);
    sizeOutput.textContent = `Size: ${newSize}px`;
    brushWidth = newSize;
  });

  const brushTool = document.querySelector("img#brush");
  if (brushTool) {
    brushTool.style.filter = activeFilter;
    active.push("brush");
  }
  
  const defaultColorId = "color-picker"; 
  const defaultColorElement = document.getElementById(defaultColorId);
  const defaultFilter = "dotted 2px black";

  if (defaultColorElement) {
    defaultColorElement.style.border = defaultFilter;
    active_.push(defaultColorId);
    if(colorPickerInput) {
        selectedColor = colorPickerInput.value;
        previousColor = selectedColor;
        colorPickerParent.style.backgroundColor = selectedColor;
    }
  }
});

const startDrawing = (e) => {
  presentMouseX = e.offsetX;
  presentMouseY = e.offsetY;
  isDrawing = true;
  ctx.beginPath();
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  ctx.lineWidth = brushWidth;

  st = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(st, 0, 0);

  const currentToolId = active.length > 0 ? active[active.length - 1] : "brush";

  console.log(currentToolId);

  if (currentToolId === "brush" || currentToolId === "eraser") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentToolId === "rectangle") {
    drawRect(e);
  } else if (currentToolId === "circle") {
    drawCircle(e);
  } else if (currentToolId === "triangle") {
    drawTriangle(e);
  }else if (currentToolId === "line") {
    drawLine(e);
  }else if (currentToolId === "square") {
    drawSquare(e);
  }
};

tools.forEach((but) => {
  but.addEventListener("click", () => {
    const newToolElement =
      but.querySelector("img") || but.querySelector("input") || but;
    const newToolId = newToolElement.id || but.id;
    
    if (newToolId === "eraser") {
      previousColor = selectedColor;
      selectedColor = "#ffffff";
    } else if (active.length > 0 && active[active.length - 1] === "eraser") {
      selectedColor = previousColor;
    }

    const oldToolId = active.length > 0 ? active[active.length - 1] : "brush";
    if (oldToolId !== newToolId) {
      const oldToolElement = document.querySelector(`#${oldToolId}`);
      if (oldToolElement) {
        oldToolElement.style.filter = "";
      }
    }
    if (newToolElement) {
      newToolElement.style.filter = activeFilter;
    }
    active.push(newToolId);
    if (active.length > 1) {
      active.shift();
    }

    console.log(active);
    const oid = active[active.length - 1];
    console.log(oid);
  });
});

colour.forEach((btn) => {
  btn.addEventListener("click", () => {
    const activeFilter_=`dotted 2px black` 
    const newToolElement_ =btn;
    const newToolId_ = newToolElement_.id

    const oldToolId_ = active_.length > 0 ? active_[active_.length - 1] : "color-picker";
    if (oldToolId_ !== newToolId_) {
      const oldToolElement_ = document.getElementById(`${oldToolId_}`);
      if (oldToolElement_) {
        oldToolElement_.style.border = "";
      }
    }
    
    newToolElement_.style.border = activeFilter_;
    active_.push(newToolId_);
    if (active_.length > 1) {
      active_.shift();
    }
    
    let newColor;
    if (newToolElement_.id === 'color-picker' && colorPickerInput) {
        newColor = colorPickerInput.value;
    } else {
        newColor = window.getComputedStyle(newToolElement_).backgroundColor;
    }
    
    previousColor = newColor;

    if (active[active.length - 1] !== "eraser") {
        selectedColor = newColor;
    } 
    
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    console.log(selectedColor);
    console.log(active_);
  });
});

if (colorPickerInput) {
  colorPickerInput.addEventListener("input", (e) => {
    let newColor = e.target.value;
    
    previousColor = newColor;
    
    if (active[active.length - 1] !== "eraser") {
        selectedColor = newColor;
    }
    
    colorPickerParent.style.backgroundColor = newColor;
    
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    
    colorPickerParent.click();
  });
}

clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveImageBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});