const svg = d3.select("#svg-container")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

const scale = 125;
const offset = 250;
const k = Math.sqrt(1.5);
const b = 1 / Math.sqrt(3);

function path(t) {
    if (t <= 1/6) {
        const s = -6 * t; // x от 0 до -1
        return {x: s, y: k * s};
    } else if (t <= 2/6) {
        // нжний эллипс: от (-1, -1.224) к (1, -1.224)
        const theta = Math.PI + (6 * (t - 1/6)) * Math.PI; // от π до 2π
        return {x: Math.cos(theta), y: -1.2 + b * Math.sin(theta)};
    } else if (t <= 3/6) {
        const u = 1 - 6 * (t - 2/6); // x от 1 до 0
        return {x: u, y: -k * u};
    } else if (t <= 4/6) {
        const s = 6 * (t - 3/6); // x от 0 до 1
        return {x: s, y: k * s};
    } else if (t <= 5/6) {
        // верхний эллипс: от (1, 1.224) к (-1, 1.224)
        const theta = (6 * (t - 4/6)) * Math.PI; // от 0 до π
        return {x: Math.cos(theta), y: 1.2 + b * Math.sin(theta)};
    } else {
        const u = -1 + 6 * (t - 5/6); // x от -1 до 0
        return {x: u, y: -k * u};
    }
}

//траекторий    
const numPoints = 200;
const points = d3.range(0, 1 + 1/numPoints, 1/numPoints).map(t => {
    const pos = path(t);
    return [offset + scale * pos.x, offset + scale * pos.y];
});

const lineGenerator = d3.line()
    .x(d => d[0])
    .y(d => d[1]);

svg.append("path")
    .attr("id", "trajectory")
    .attr("d", lineGenerator(points))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

const drawing = svg.append("g")
    .attr("id", "drawing")
    .attr("transform", "translate(250, 250)");

drawing.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 10)
    .attr("fill", "blue");

drawing.append("circle")
    .attr("cx", 20)
    .attr("cy", 0)
    .attr("r", 10)
    .attr("fill", "red");

drawing.append("circle")
    .attr("cx", -20)
    .attr("cy", 0)
    .attr("r", 10)
    .attr("fill", "red");

drawing.append("circle")
    .attr("cx", 0)
    .attr("cy", 25)
    .attr("r", 10)
    .attr("fill", "red");

drawing.append("circle")
    .attr("cx", 0)
    .attr("cy", -20)
    .attr("r", 10)
    .attr("fill", "red");

drawing.append("rect")
    .attr("x", -25)
    .attr("y", -25)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "none")
    .attr("stroke", "black");

d3.select("#clear-button").on("click", function() {
    drawing.interrupt();

    drawing.attr("transform", "translate(250, 250)");
    
});

d3.select("#start-button").on("click", function() {
    const duration = +d3.select("#duration").property("value");
    const maxScale = +d3.select("#maxScale").property("value");
    const minScale = +d3.select("#minScale").property("value");
    const rotationSpeed = +d3.select("#rotationSpeed").property("value");
    
    const drawing = d3.select("#drawing");
    drawing.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attrTween("animate", function() {
            return function(t) {
                const pos = path(1-t);
                const x_svg = offset + scale * pos.x;
                const y_svg = offset + scale * pos.y;
                
                const scaleValue = 1 + maxScale - minScale;
                
                const angle = 360 * rotationSpeed * t*(-1);
                
                drawing.attr("transform", 
                    `translate(${x_svg}, ${y_svg}) rotate(${angle}) scale(${scaleValue}, ${scaleValue})`
                );
            };
        });
});