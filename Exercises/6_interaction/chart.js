const svgWidth = 600,
    svgHeight = 560,
    margin = { top: 30, right: 30, bottom: 60, left: 60 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

let scatterSvg = d3.select("#scatterplot-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
let scatterContainer = scatterSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let histogramSvg1 = d3.select("#histogram1-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight/2+40);
let H1Container = histogramSvg1.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
let H1Overlay = histogramSvg1.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let histogramSvg2 = d3.select("#histogram2-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight/2+40);
let H2Container = histogramSvg2.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
let H2Overlay = histogramSvg2.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let brush = d3.brush()
    .on("start brush", handleBrush)
    .on("end", updateRender)

// variables with global scope:
// these are variables that get used across multiple function scopes below
let scatterData,
    filteredBarData,
    scatterPoints,
    scatterXScale, // the error I had to debug at the end of class was a typo here
    scatterYScale,
    barXScale,
    barYScale,
    brushCoords, 
    H1_bins,
    H2_bins; // to debug, I also had to make sure this var was available in the scope of both the handleBrush and brushFilter functions

d3.csv("cars.csv")
    .then(function (data) {
        console.log(data);
        // console.log(Object.keys(data[0]));
        scatterData = deepCopy(data);

        /*Scatterplots*/
        // Scatterplot scales
        scatterXScale = d3.scaleLinear()
            .domain(d3.extent(scatterData, (d) => +d.hp))
            .range([0, width]);
        scatterYScale = d3.scaleLinear()
            .domain(d3.extent(scatterData, (d) => +d.mpg))
            .range([height, 0]);

        // Scatterplot axes
        let scatterXAxis = scatterSvg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
            .call(d3.axisBottom(scatterXScale));
        let scatterYAxis = scatterSvg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(scatterYScale));
        
        // Axis titles
        scatterSvg.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + width / 2) // Position at the middle of the axis
            .attr("y", margin.top + height + 40) // Position below the x-axis
            .text("Gross Horsepower (hp)");
        scatterSvg.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-90)`) // Rotate text for y-axis
            .attr("x", -(margin.top + height / 2)) // Position at the middle of the axis
            .attr("y", margin.left - 40) // Position left of the y-axis
            .text("Miles per Gallon (mpg)");

        // Scatterplot marks
        scatterPoints = scatterContainer.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("class", "non-brushed")
            .attr("cx", (d) => scatterXScale(+d.hp))
            .attr("cy", (d) => scatterYScale(+d.mpg))
            .attr("r", 5);

        scatterContainer.append("g")
            .call(brush);

        /*Histograms*/
        // Histogram 1
        let H1 = d3.histogram()
            .value((d) => +d.hp) // Use the hp value for binning
            .domain(scatterXScale.domain()) // Use the same domain as scatterXScale
            .thresholds(scatterXScale.ticks(8)); // Create thresholds for the bins
        H1_bins = H1(data); // Generate bins

        // Scales
        x1Scale = d3.scaleLinear()
            .domain(scatterXScale.domain())
            .range([0, width])
        y1Scale = d3.scaleLinear()
            .domain([0,d3.max(H1_bins, bin => bin.length)])
            .range([height/2, 0]);
        // Axes
        let xAxis = histogramSvg1.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top + height/2})`)
            .call(d3.axisBottom(x1Scale));
        let yAxis = histogramSvg1.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(y1Scale));
        // Titles
        histogramSvg1.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + width / 2) // Position at the middle of the axis
            .attr("y", margin.top + height/2 + 40) // Position below the x-axis
            .text("Gross Horsepower (hp)");
        histogramSvg1.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-90)`) // Rotate text for y-axis
            .attr("x", -(margin.top + height/4)) // Position at the middle of the axis
            .attr("y", margin.left - 40) // Position left of the y-axis
            .text("Count");
        // Plotting bars
        H1Container.selectAll("rect")
            .data(H1_bins)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x1Scale(d.x0)+1)
            .attr("y", (d) => y1Scale(d.length))
            .attr("width", d => x1Scale(d.x1) - x1Scale(d.x0) - 1)
            .attr("height", d => height/2 - y1Scale(d.length)-1)
            .style("fill", "#D1C7D3")

        // Histogram 2
        let H2 = d3.histogram()
            .value((d) => +d.mpg) // Use the hp value for binning
            .domain(scatterYScale.domain()) // Use the same domain as scatterXScale
            .thresholds(scatterYScale.ticks(7)); // Create thresholds for the bins
        H2_bins = H2(data); // Generate bins
        // Scales
        x2Scale = d3.scaleLinear()
            .domain(scatterYScale.domain())
            .range([0, width])
        y2Scale = d3.scaleLinear()
            .domain([0,d3.max(H2_bins, bin => bin.length)])
            .range([height/2, 0]);
        // Axes
        let x2Axis = histogramSvg2.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top + height/2})`)
            .call(d3.axisBottom(x2Scale));
        let y2Axis = histogramSvg2.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(y2Scale));
        // Titles
        histogramSvg2.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + width / 2) // Position at the middle of the axis
            .attr("y", margin.top + height/2 + 40) // Position below the x-axis
            .text("Miles per Gallon (mpg)");
        histogramSvg2.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("transform", `rotate(-90)`) // Rotate text for y-axis
            .attr("x", -(margin.top + height/4)) // Position at the middle of the axis
            .attr("y", margin.left - 40) // Position left of the y-axis
            .text("Count");
        // Plotting bars
        H2Container.selectAll("rect")
            .data(H2_bins)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x2Scale(d.x0)+1)
            .attr("y", (d) => y2Scale(d.length))
            .attr("width", d => x2Scale(d.x1) - x2Scale(d.x0) - 1)
            .attr("height", d => height/2 - y2Scale(d.length)-1)
            .style("fill", "#D1C7D3")
        
    })
    .catch(function (err) {
        console.error(err);
    });

// helper functions
function deepCopy(inObject) {
    let outObject, value, key;
    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        value = inObject[key];
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopy(value);
    }
    return outObject;
}


function handleBrush(event) {
    // console.log(event);

    // revert points to initial style
    scatterPoints.attr("class", "non-brushed");

    if (event.selection != null) {
        let brushCoordsD3 = d3.brushSelection(this);
        brushCoords = {
            "x0": brushCoordsD3[0][0],
            "x1": brushCoordsD3[1][0],
            "y0": brushCoordsD3[0][1],
            "y1": brushCoordsD3[1][1]
        }

        // Style brushed points
        scatterPoints.filter(brushFilter)
            .attr("class", "brushed");
        
        // Filter bar data
        let filteredScatterData = scatterData.filter(brushFilter);
        // console.log("Selected points: ");
        // console.log(filteredScatterData);
        filteredHistogtam1Data = getHistogram1Data(filteredScatterData);
        filteredHistogtam2Data = getHistogram2Data(filteredScatterData);
        
        // Render bars in real time
        updateRender();
    }
}

function findBinForValue(bins, value) {
    for (let bin of bins) {
        // Check if the value falls within the bin's range
        if (value >= bin.x0 && value < bin.x1) {return bin;}
    }
    if (value == bins[bins.length - 1].x1) {return bins[bins.length - 1];}
    return null;
}

function getHistogram1Data(selectedData){
    let returnData = [];
    // Init count 0
    for (let bin of H1_bins) {
        returnData.push({"bin": bin,"count":0});
    }
    // Counting
    selectedData.forEach((obj) => {
        let idx = findBinForValue(H1_bins, obj.hp);
        for (let record of returnData) {
            if (record.bin==idx){record.count++;}
        }
    });
    return returnData;
}

function getHistogram2Data(selectedData){
    let returnData = [];
    // Init count 0
    for (let bin of H2_bins) {
        returnData.push({"bin": bin,"count":0});
    }
    // Counting
    selectedData.forEach((obj) => {
        let idx = findBinForValue(H2_bins, obj.mpg);
        for (let record of returnData) {
            if (record.bin==idx){record.count++;}
        }
    });
    return returnData;
}

function brushFilter(d) {
    // Iterating over data bound to my points
    let cx = scatterXScale(+d.hp),
        cy = scatterYScale(+d.mpg);

    // Get only points inside of brush
    return (brushCoords.x0 <= cx && brushCoords.x1 >= cx && brushCoords.y0 <= cy && brushCoords.y1 >= cy);
}

function updateRender() {
    // foreground bars
    H1Overlay.selectAll("rect")
        .data(filteredHistogtam1Data)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => x1Scale(d.bin.x0))
        .attr("y", (d) => y1Scale(d.count))
        .attr("width", d => x1Scale(d.bin.x1) - x1Scale(d.bin.x0))
        .attr("height", (d) => height/2 - y1Scale(d.count))
    H2Overlay.selectAll("rect")
        .data(filteredHistogtam2Data)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => x2Scale(d.bin.x0))
        .attr("y", (d) => y2Scale(d.count))
        .attr("width", d => x2Scale(d.bin.x1) - x2Scale(d.bin.x0))
        .attr("height", (d) => height/2 - y2Scale(d.count))
}