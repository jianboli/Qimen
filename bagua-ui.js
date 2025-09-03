// Bagua UI functionality for the Qimen Grid App

// Function to draw a Taiji (Yin-Yang) symbol
function drawTaiji(svg, center, radius) {
    const arc = d3.arc();                
    // Main black half
    svg.append("path")
    .attr("d", arc({
        innerRadius: 0,
        outerRadius: radius,
        startAngle: -Math.PI,
        endAngle: Math.PI
    }))
    .attr("fill", "black")
    .attr("transform", `translate(${center.x}, ${center.y})`);

    // Main white half
    svg.append("path")
    .attr("d", arc({
        innerRadius: 0,
        outerRadius: radius,
        startAngle: Math.PI,
        endAngle: 2 * Math.PI
    }))
    .attr("fill", "white")
    .attr("transform", `translate(${center.x}, ${center.y})`);
    
    svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", radius) // same as the Taiji radius
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1);                

    // Small white circle on black side
    svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y - radius / 2)
    .attr("r", radius / 2)
    .attr("fill", "white");

    // Small black circle on white side
    svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y + radius / 2)
    .attr("r", radius / 2)
    .attr("fill", "black");

    // Small black dot in white area
    svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y - radius / 2)
    .attr("r", radius / 10)
    .attr("fill", "black");

    // Small white dot in black area
    svg.append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y + radius / 2)
    .attr("r", radius / 10)
    .attr("fill", "white");
}

function text_rotation_x(center_x, radius, angle) {
    return center_x + radius * Math.cos((angle - 90) * Math.PI / 180)
}

function text_rotation_y(center_y, radius, angle) {
    return center_y + radius * Math.sin((angle - 90) * Math.PI / 180)
}

function label(svg, trigrams, get_label, radius, center, class_name, fontSize) {
    svg.selectAll(`text.${class_name}`)
    .data(trigrams)
    .enter()
    .append("text")
    .attr("class", class_name)
    .attr("x", d => text_rotation_x(center.x, radius, d.angle))
    .attr("y", d => text_rotation_y(center.y, radius, d.angle))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", fontSize)
    .attr("transform", d => {
        const x = text_rotation_x(center.x, radius, d.angle);
        const y = text_rotation_y(center.y, radius, d.angle);
        return `rotate(${180+d.angle}, ${x}, ${y})`;
    })
    .text(get_label);
     
}

// Initialize bagua function
function initializeBagua() {
    const svg = d3.select('#bagua-tab svg');
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const center = { x: width / 2, y: height / 2 };
    const taijiRadius = 40;
    const baguaRadius = taijiRadius + 20;
    const labelRadius = baguaRadius+20;
    const numberRadius = labelRadius+15;

    // The 8 trigrams 
    const trigrams = [
        { name: "☲", label: "離", number: "九", angle: 0 },
        { name: "☷", label: "坤", number: "二", angle: 45 },
        { name: "☱", label: "兌", number: "七", angle: 90 },
        { name: "☰", label: "乾", number: "六", angle: 135 },
        { name: "☵", label: "坎", number: "一", angle: 180 },
        { name: "☶", label: "艮", number: "八", angle: 225 },
        { name: "☳", label: "震", number: "三", angle: 270 },
        { name: "☴", label: "巽", number: "四", angle: 315 }
    ];
    // Draw trigrams in a circle
    label(svg, trigrams, d => d.name, baguaRadius, center, "trigram", "30px");
    // Draw labels underneath
    label(svg, trigrams, d => d.label, labelRadius, center, "label", "12px");
    label(svg, trigrams, d => d.number, numberRadius, center, "number", "12px");
    
    // Call the function
    drawTaiji(svg, center, taijiRadius);

}
