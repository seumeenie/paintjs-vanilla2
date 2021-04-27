/**
 * canvas : 한 공간의 pixel을 다루는 html5의 한 요소
 * canvas를 사용해 VanillaJS로 그림을 그리는 javascript 파일
 */

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d"); // getContext : width,height를 지정한 canvas안에서 pixel을 컨트롤 함
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");

const INITIAL_COLOR = "#2c2c2c"; //그릴 선들이 수정 전 이 색을 가짐
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

//canvas가 loading되자마자 배경(filling)이 white가 설정되게 함
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5; //선의 너비

let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}
//모든 움직임을 감지
//마우스는 항상 움직이고 있음.
// painting = false; 상태에선 path만 만들고 있음 -> 마우스가 가는 곳으로 path를 움직이는 것
function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    //beginPath와 lineTo를 이용해 선을 만드는 작업
    if (!painting) {
        //path를 만드는 작업
        //클릭하지 않고 움직였을 때
        ctx.beginPath(); //path = 선, path를 만들고
        ctx.moveTo(x, y); //x,y 좌표로 path를 옮김 -> 마우스를 움직이는 모든 순간에 path를 만듬 
      } else {
          //line을 만드는 작업
          //클릭하고 마우스를 움직이는 내내 발생(startpoint,endpoint가 아님)
        ctx.lineTo(x, y); //path의 이전 위치(moveTo의 x,y)부터 지금 위치(lineTo의 x,y)까지 선을 만듬
        ctx.stroke();//눈에 보이는 선을 그음(획 긋기)
      }
}
//컬러 변경
// stroke(=painting)와 filling의 색을 설정
function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color; // color를 target으로부터 받아서 INITIAL_COLOR(= "#2c2c2c")였던 ctx.strokeStyle을 바꿈
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

//모드 형태로
//fill 버튼 클릭시 버튼 내부 text가 Paint로 변경되게하고 filling mode상태가 되게 함
//Paint 버튼 클릭시 버튼 내부 text가 Fill로 변경되게하고 painting mode상태가 되게 함
function handleModeClick() {
    if (filling === true) {
      filling = false;
      mode.innerText = "Fill";
    } else {
      filling = true;
      mode.innerText = "Paint";
    }
}

function handleCanvasClick() {
    if (filling) { //if문으로 filling variable(변수)를 만듬 -> filling을 하고 선도 그을 수 있게(=painting도 할 수 있게)
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

//마우스 우클릭 방지
function handleCM(event) {
    event.preventDefault();
}

//javascript로 image 만들기
//browser에 PaintJS[🎨].png가 생기게 하는 이미지 저장 역할
  function handleSaveClick() {
    const image = canvas.toDataURL(); //toDataURL() : (기본적으로 PNG로 설정된)type parameter에 의해 지정된 포맷의 이미지 표현을 포함한 data URL을 반환
    const link = document.createElement("a"); //존재하지 않는 링크 생성
    link.href = image; //href는 image(URL)가 되어야 함
    link.download = "PaintJS[🎨]"; //download는 이름을 가져야 됨
    link.click();
}
//캔버스가 있으면 event함수를 실행
if(canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting); //마우스를 누르고 있을 때
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM); //우클릭으로 이미지를 저장하지 않게 할 때 contextmenu라는 이벤트를 사용 ( contextmenu가 실행될 때 발생)
}

//Array.from() : object로부터 array를 만듬.
//forEach로 color를 돌려서 addEventListener호출
Array.from(colors).forEach(col => //col : array안에 있는 각각의 아이템들을 대표하는 것일 뿐. 수정 가능
    col.addEventListener("click", handleColorClick)
);

if (range) {
    range.addEventListener("input", handleRangeChange);
}
  
if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}