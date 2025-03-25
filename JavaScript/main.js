const width = 600;
const height = 600;
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Начальные смайлики
let pict = drawSmile(svg);
pict.attr("transform", "translate(200, 200)");

let pict1 = drawSmile(svg);
pict1.attr("transform", `translate(400, 400) scale(1.5, 1.5) rotate(180)`);

// Функция рисования (для кнопки "Нарисовать")
let draw = (dataForm) => {
    const svg = d3.select("svg");
    let pict = drawSmile(svg);
    pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value})
                                scale(${dataForm.scaleX.value}, ${dataForm.scaleY.value})
                                rotate(${dataForm.rotate.value})`);
};

let runAnimation = (dataForm) => {
    const svg = d3.select("svg");
    const pathAnimateCheckbox = document.getElementById("pathAnimate");

    const animationType = document.getElementById("animationType").value;

    let easeMethod;
    if (animationType === "linear") {
        easeMethod = d3.easeLinear;
    } else if (animationType === "elastic") {
        easeMethod = d3.easeElastic;
    } else if (animationType === "bounce") {
        easeMethod = d3.easeBounce;
    }

    if (!pathAnimateCheckbox.checked) {
        let pict = drawSmile(svg);

        pict.attr("transform", `translate(${dataForm.cx.value}, ${dataForm.cy.value})
                                scale(${dataForm.scaleX.value}, ${dataForm.scaleY.value})
                                rotate(${dataForm.rotate.value})`)
            .transition()
            .duration(6000)
            .ease(easeMethod)
            .attr("transform", `translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value})
                                scale(${dataForm.scaleXEnd.value}, ${dataForm.scaleYEnd.value})
                                rotate(${dataForm.rotateEnd.value})`);
        /* анимация в соответствии с настройками формы */ 
    } else if (pathAnimateCheckbox.checked) {
        let pict = drawSmile(svg);

        let path = drawPath(document.getElementById("pathType").value);
        pict.transition()
            .ease(easeMethod)
            .duration(6000)
            .attrTween('transform', translateAlong(path.node()));
    }
};

const createForm = document.getElementById("setting");
const createInputs = createForm.getElementsByTagName("input");

let createButton, animateButton, clearButton;

for (let i = 0; i < createInputs.length; i++) {
    if (createInputs[i].value === "Нарисовать") {
        createButton = createInputs[i];
    }
    if (createInputs[i].value === "Анимировать") {
        animateButton = createInputs[i];
    }
    if (createInputs[i].value === "Очистить") {
        clearButton = createInputs[i];
    }
}

const animateCheckbox = document.getElementById("animate");
const pathAnimateCheckbox = document.getElementById("pathAnimate");
const animationFields = document.getElementsByClassName("animation-field");
const pathSection = document.getElementsByClassName("path-section")[0];
const pathCheckbox = document.getElementsByClassName("path-checkbox")[0];
const coordinatesSection = document.getElementsByClassName("form-section")[0];
const scaleSection= document.getElementsByClassName("form-section")[2]
const rotationSection = document.getElementsByClassName("form-section")[3];

function toggleAnimationFields() {
    for (let i = 0; i < animationFields.length; i++) {
        if (animateCheckbox.checked) {
            animationFields[i].classList.remove("hidden");
        } else {
            animationFields[i].classList.add("hidden");
        }
    }

    if (animateCheckbox.checked) {
        createButton.classList.add("hidden");
        animateButton.classList.remove("hidden");
        pathCheckbox.classList.remove("hidden");
    } else {
        createButton.classList.remove("hidden");
        animateButton.classList.add("hidden");
        pathCheckbox.classList.add("hidden");
        pathAnimateCheckbox.checked = false;
        togglePathFields();
    }
}

function togglePathFields() {
    if (pathAnimateCheckbox.checked) {
        pathSection.classList.remove("hidden");
        coordinatesSection.classList.add("hidden");
        scaleSection.classList.add("hidden");
        rotationSection.classList.add("hidden");
    } else {
        pathSection.classList.add("hidden");
        coordinatesSection.classList.remove("hidden");
        scaleSection.classList.remove("hidden");
        rotationSection.classList.remove("hidden");
    }
}

function clearSVG() {
    svg.selectAll("*").remove();
}

createButton.onclick = function () {
    draw(document.getElementById("setting"));
};

animateButton.onclick = function () {
    runAnimation(document.getElementById("setting"));
};

clearButton.onclick = function () {
    clearSVG();
};

animateCheckbox.onchange = toggleAnimationFields;
pathAnimateCheckbox.onchange = togglePathFields;