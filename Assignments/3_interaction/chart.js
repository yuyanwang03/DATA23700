const svgWidth = 400, svgHeight = 400,
    margin = { top: 30, right: 30, bottom: 60, left: 60 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

const ctrsvglWidth = 600, ctrsvglHeight = 600, 
    ctrmargin = { top: 30, right: 30, bottom: 60, left: 60 },
    ctrwidth = ctrsvglWidth - ctrmargin.left - ctrmargin.right,
    ctrheight = ctrsvglHeight - ctrmargin.top - ctrmargin.bottom;

let scatterSvg = d3.select("#scatterplot1-container").append("svg")
    .attr("width", ctrsvglWidth)
    .attr("height", ctrsvglHeight);
scatterSvg.append("text")
    .attr("class", "plot-title")
    .attr("x", (ctrwidth+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Embedding Coordinates");
let scatterContainer = scatterSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let scatterSvg2 = d3.select("#scatterplot2-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
scatterSvg2.append("text")
    .attr("class", "plot-title")
    .attr("x", (width+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Longitude and Latitude");
let scatterContainer2 = scatterSvg2.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let barSvg = d3.select("#bar-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
barSvg.append("text")
    .attr("class", "plot-title")
    .attr("x", (width+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Ocean Proximity Bar Plot");
let barContainer = barSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
let barOverlay = barSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let histogramSvg1 = d3.select("#histogram1-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight/2+40);
histogramSvg1.append("text")
    .attr("class", "plot-title")
    .attr("x", (width+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Histogram of Median House Value (US Dollars)");
let H1Container = histogramSvg1.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
let H1Overlay = histogramSvg1.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let histogramSvg2 = d3.select("#histogram2-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight/2+40);
histogramSvg2.append("text")
    .attr("class", "plot-title")
    .attr("x", (width+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Histogram of Median House Age (Years)");
let H2Container = histogramSvg2.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
let H2Overlay = histogramSvg2.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let histogramSvg3 = d3.select("#histogram3-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight/2+40);
histogramSvg3.append("text")
    .attr("class", "plot-title")
    .attr("x", (width+2*margin.left) / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Histogram of Median Income (tens of thousands of US Dollars)");
let H3Container = histogramSvg3.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
let H3Overlay = histogramSvg3.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let brush = d3.brush()
    .on("start brush", handleBrush)
    .on("end", updateRender)

// variables with global scope:
let scatterData,
    filteredBarData,
    scatterPoints,
    scatterXScale, 
    scatterYScale,
    scatterXScale2,
    scatterYScale2,
    scatterPoints2,
    barXScale,
    barYScale,
    brushCoords,
    H1_bins,
    H2_bins,
    H3_bins;

d3.csv("3_ca-housing-umap.csv")
    .then(function (data) {
        console.log(data);

        scatterData = deepCopy(data);

        { // Central Graph
            // Scatterplot scales
            scatterXScale = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.x))
                .range([0, ctrwidth]);
            scatterYScale = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.y))
                .range([ctrheight, 0]);
            // Scatterplot axes
            let scatterXAxis = scatterSvg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${margin.left}, ${margin.top + ctrheight})`)
                .call(d3.axisBottom(scatterXScale));
            let scatterYAxis = scatterSvg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(scatterYScale));
            // Scatterplot titles
            scatterSvg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + ctrwidth / 2) // Position at the middle of the axis
                .attr("y", margin.top + ctrheight + 40) // Position below the x-axis
                .text("x");
            scatterSvg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`) // Rotate text for y-axis
                .attr("x", -(margin.top + ctrheight / 2)) // Position at the middle of the axis
                .attr("y", margin.left - 40) // Position left of the y-axis
                .text("y");
            // Scatterplot marks
            scatterPoints = scatterContainer.selectAll("circle")
                .data(data)
                .join("circle")
                .attr("class", "non-brushed")
                .attr("cx", (d) => scatterXScale(+d.x))
                .attr("cy", (d) => scatterYScale(+d.y))
                .attr("r", 1);
            // Scatterplot Brush
            scatterContainer.append("g").call(brush);
        }
        
        { // Ocean Proximity Bar Graph
            let barData = getBarData(data);
            // console.log(barData);
            // Bar scales
            barXScale = d3.scaleBand()
                .domain(barData.map(function(d) {return d.ocean_proximity;}))
                .range([0, width])
                .padding(0.2);
            barYScale = d3.scaleLinear()
                .domain([0, d3.max(barData, (d) => d.count)])
                .range([height, 0]);
            // Bar axes
            let barXAxis = barSvg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
                .call(d3.axisBottom(barXScale))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-25)")
                    .style("text-anchor", "end");
            let barYAxis = barSvg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(barYScale));
            // Bar axes titles
            barXAxis.append("text")
                .attr("class", "axis-title")
                .attr("x", width / 2)
                .attr("y", margin.bottom - 10) 
                .style("text-anchor", "middle")
                .text("Ocean Proximity");
            barYAxis.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .style("text-anchor", "middle")
                .text("Counts");
            // Bar marks
            bars = barContainer.selectAll("rect")
                .data(barData)
                .join("rect")
                .attr("class", "non-brushed")
                .attr("x", (d) => barXScale(d.ocean_proximity))
                .attr("y", (d) => barYScale(d.count))
                .attr("width", barXScale.bandwidth())
                .attr("height", (d) => height - barYScale(d.count));
            // Reacting to click on bars
            bars.on('click', function() {
                let clickedData = d3.select(this).data()[0]; // Get the data bound to the clicked element
                crossfilterByBars(clickedData.ocean_proximity);
            });
        }

        { // Longitude and Latitude ScatterPlot
            // Scatterplot scales
            scatterXScale2 = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.latitude))
                .range([0, width]);
            scatterYScale2 = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.longitude))
                .range([height, 0]);
            // Scatterplot axes
            scatterSvg2.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
                .call(d3.axisBottom(scatterXScale2))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-25)")
                    .style("text-anchor", "end");
            scatterSvg2.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(scatterYScale2));
            // Scatterplot titles
            scatterSvg2.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", margin.top + height + 40)
                .text("Latitude");
            scatterSvg2.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`) 
                .attr("x", -(margin.top + height / 2))
                .attr("y", margin.left - 40)
                .text("Longitude");
            // Scatterplot marks
            scatterPoints2 = scatterContainer2.selectAll("circle")
                .data(data)
                .join("circle")
                .attr("class", "non-brushed")
                .attr("cx", (d) => scatterXScale2(+d.latitude))
                .attr("cy", (d) => scatterYScale2(+d.longitude))
                .attr("r", 1);
        }

        { // Median House Value Histogram
            // let modifiedData = data.map(item => {
            //     return {...item, median_house_value: item.median_house_value / 1000};
            // });
            // console.log(modifiedData);
            let H1 = d3.histogram()
                .value((d) => +d.median_house_value)
                .domain(d3.extent(data, (d) => +d.median_house_value));
            H1_bins = H1(data);
            // console.log(H1_bins);
            // Scales
            histogramXScale1 = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.median_house_value))
                .range([0, width])
            histogramYScale1 = d3.scaleLinear()
                .domain([0,d3.max(H1_bins, bin => bin.length)])
                .range([height/2, 0]);
            // Axes
            histogramSvg1.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top + height/2})`)
                .call(d3.axisBottom(histogramXScale1))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-25)")
                    .style("text-anchor", "end");
            histogramSvg1.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(histogramYScale1));
            // Titles
            histogramSvg1.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", margin.top + height/2 + 40)
                .text("Median House Value (in US Dollars)");
            histogramSvg1.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`)
                .attr("x", -(margin.top + height/4))
                .attr("y", margin.left - 40)
                .text("Count");
            // Plotting bars
            H1_bars = H1Container.selectAll("rect")
                .data(H1_bins)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => histogramXScale1(d.x0)+1)
                .attr("y", (d) => histogramYScale1(d.length))
                .attr("width", d => histogramXScale1(d.x1) - histogramXScale1(d.x0) - 1)
                .attr("height", d => height/2 - histogramYScale1(d.length)-1)
                .style("fill", "#D1C7D3")
            // Reacting to click on histogram bars
            H1_bars.on('click', function() {
                    let clickedData = d3.select(this).data()[0]; // Get the data bound to the clicked element
                    crossfilterByHistogram("median_house_value", clickedData.x0, clickedData.x1);
            });
        }

        { // Housing Median Age Histogram
            let H2 = d3.histogram()
                .value((d) => +d.housing_median_age)
                .domain(d3.extent(data, (d) => +d.housing_median_age));
            H2_bins = H2(data);
            // console.log(H2_bins);
            // Scales
            histogramXScale2 = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.housing_median_age))
                .range([0, width])
            histogramYScale2 = d3.scaleLinear()
                .domain([0,d3.max(H2_bins, bin => bin.length)])
                .range([height/2, 0]);
            // Axes
            histogramSvg2.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top + height/2})`)
                .call(d3.axisBottom(histogramXScale2))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-25)")
                    .style("text-anchor", "end");
            histogramSvg2.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(histogramYScale2));
            // Titles
            histogramSvg2.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", margin.top + height/2 + 40)
                .text("Median House Age (in years)");
            histogramSvg2.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`)
                .attr("x", -(margin.top + height/4)) 
                .attr("y", margin.left - 40)
                .text("Count");
            // Plotting bars
            H2_bars = H2Container.selectAll("rect")
                .data(H2_bins)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => histogramXScale2(d.x0)+1)
                .attr("y", (d) => histogramYScale2(d.length))
                .attr("width", d => histogramXScale2(d.x1) - histogramXScale2(d.x0) - 1)
                .attr("height", d => height/2 - histogramYScale2(d.length)-1)
                .style("fill", "#D1C7D3")
            // Reacting to click on histogram bars
            H2_bars.on('click', function() {
                    let clickedData = d3.select(this).data()[0]; // Get the data bound to the clicked element
                    crossfilterByHistogram("housing_median_age", clickedData.x0, clickedData.x1);
            });
        }
        
        { // Median Income Histogram
            let H3 = d3.histogram()
                .value((d) => +d.median_income)
                .domain(d3.extent(data, (d) => +d.median_income));
            H3_bins = H3(data);
            // console.log(H3_bins);
            // Scales
            histogramXScale3 = d3.scaleLinear()
                .domain(d3.extent(data, (d) => +d.median_income))
                .range([0, width])
            histogramYScale3 = d3.scaleLinear()
                .domain([0,d3.max(H3_bins, bin => bin.length)])
                .range([height/2, 0]);
            // Axes
            histogramSvg3.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top + height/2})`)
                .call(d3.axisBottom(histogramXScale3))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-25)")
                    .style("text-anchor", "end");
            histogramSvg3.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(d3.axisLeft(histogramYScale3));
            // Titles
            histogramSvg3.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", margin.top + height/2 + 40)
                .text("Median Income (10,000 dollars)");
            histogramSvg3.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", `rotate(-90)`)
                .attr("x", -(margin.top + height/4))
                .attr("y", margin.left - 40)
                .text("Count");
            // Plotting bars
            H3_bars = H3Container.selectAll("rect")
                .data(H3_bins)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => histogramXScale3(d.x0)+1)
                .attr("y", (d) => histogramYScale3(d.length))
                .attr("width", d => histogramXScale3(d.x1) - histogramXScale3(d.x0) - 1)
                .attr("height", d => height/2 - histogramYScale3(d.length)-1)
                .style("fill", "#D1C7D3")
            // Reacting to click on histogram bars
            H3_bars.on('click', function() {
                    let clickedData = d3.select(this).data()[0];
                    crossfilterByHistogram("median_income", clickedData.x0, clickedData.x1);
            });
        }
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
    // Revert points to initial style
    scatterPoints.attr("class", "non-brushed");
    scatterPoints2.attr("class", "non-brushed");
    if (event.selection != null) {
        let brushCoordsD3 = d3.brushSelection(this);
        brushCoords = {
            "x0": brushCoordsD3[0][0],
            "x1": brushCoordsD3[1][0],
            "y0": brushCoordsD3[0][1],
            "y1": brushCoordsD3[1][1]
        }
        // Style brushed points
        scatterPoints.filter(brushFilter).attr("class", "brushed");
        // Filter target data
        let filteredScatterData = scatterData.filter(brushFilter);
        // console.log(filteredScatterData);
        filteredBarData = getBarData(filteredScatterData);
        filteredHistogtam1Data = getHistogramData(filteredScatterData, H1_bins, "median_house_value");
        filteredHistogtam2Data = getHistogramData(filteredScatterData, H2_bins, "housing_median_age");
        filteredHistogtam3Data = getHistogramData(filteredScatterData, H3_bins, "median_income");
        filteredScatter2Data = scatterPoints2.filter(point2 => filteredScatterData.some(point1 => 
            point1.latitude === point2.latitude && point1.longitude === point2.longitude));
        // Render bars in real time
        updateRender();
    }
}

function crossfilterByHistogram(v, x0, x1){
    console.log("Selected crossfiltering on: ", v, " Interval: ", x0, x1);
    scatterPoints.attr("class", "non-brushed");
    scatterPoints2.attr("class", "non-brushed");
    // Filter target data
    filteredData = scatterPoints.filter(point => point[v] >= x0 && point[v]<x1).data();
    // console.log(filteredData);
    scatterPoints.filter(point => point[v] >= x0 && point[v]<x1).attr("class", "brushed")
    // Use the central scatterplot's points to paint all other graphs
    filteredBarData = getBarData(filteredData);
    filteredHistogtam1Data = getHistogramData(filteredData, H1_bins, "median_house_value");
    filteredHistogtam2Data = getHistogramData(filteredData, H2_bins, "housing_median_age");
    filteredHistogtam3Data = getHistogramData(filteredData, H3_bins, "median_income");
    filteredScatter2Data = scatterPoints2.filter(point2 => filteredData.some(point1 => 
        point1.latitude === point2.latitude && point1.longitude === point2.longitude));
    updateRender();
}

function crossfilterByBars(ocean_prxmty){
    console.log("Selected crossfiltering on: Ocean Proximity with Type ", ocean_prxmty);
    scatterPoints.attr("class", "non-brushed");
    scatterPoints2.attr("class", "non-brushed");
    // Filter target data
    filteredData = scatterPoints.filter(point => point.ocean_proximity === ocean_prxmty).data();
    // console.log(filteredData);
    scatterPoints.filter(point => point.ocean_proximity === ocean_prxmty).attr("class", "brushed")
    // Use the central scatterplot's points to paint all other graphs
    filteredBarData = getBarData(filteredData);
    filteredHistogtam1Data = getHistogramData(filteredData, H1_bins, "median_house_value");
    filteredHistogtam2Data = getHistogramData(filteredData, H2_bins, "housing_median_age");
    filteredHistogtam3Data = getHistogramData(filteredData, H3_bins, "median_income");
    filteredScatter2Data = scatterPoints2.filter(point2 => filteredData.some(point1 => 
        point1.latitude === point2.latitude && point1.longitude === point2.longitude));
    updateRender();
}

function brushFilter(d) {
    // Iterating over data bound to my points
    let cx = scatterXScale(+d.x),
        cy = scatterYScale(+d.y);
    // Get only points inside of brush
    return (brushCoords.x0 <= cx && brushCoords.x1 >= cx && brushCoords.y0 <= cy && brushCoords.y1 >= cy);
}

function getBarData(filteredData) {
    let counts = {};
    // Iterate over each object and count occurrences of ocean_proximity values
    filteredData.forEach((obj) => {
        if (counts[obj.ocean_proximity]) {counts[obj.ocean_proximity] += 1;} 
        else {counts[obj.ocean_proximity] = 1;}
    });
    // Convert the counts object to an array suitable for bar chart data
    let returnData = Object.keys(counts).map(key => {return { ocean_proximity: key, count: counts[key] };});
    // console.log(returnData);
    return returnData;
}

function findBinForValue(bins, value) {
    for (let bin of bins) {
        // Check if the value falls within the bin's range
        if (value >= bin.x0 && value < bin.x1) {return bin;}
    }
    if (value == bins[bins.length - 1].x1) {return bins[bins.length - 1];}
    return null;
}

function getHistogramData(selectedData, bins, columnName) {
    let returnData = [];
    // Initialize count to 0 for each bin
    for (let bin of bins) {returnData.push({ "bin": bin, "count": 0 });}
    // Counting
    selectedData.forEach((obj) => {
        let idx = findBinForValue(bins, obj[columnName]);
        for (let record of returnData) {if (record.bin == idx) {record.count++;}}
    });
    return returnData;
}

function updateRender() {
    // foreground bars
    barOverlay.selectAll("rect")
        .data(filteredBarData)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => barXScale(d.ocean_proximity))
        .attr("y", (d) => barYScale(d.count))
        .attr("width", barXScale.bandwidth())
        .attr("height", (d) => height - barYScale(d.count));
    H1Overlay.selectAll("rect")
        .data(filteredHistogtam1Data)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => histogramXScale1(d.bin.x0))
        .attr("y", (d) => histogramYScale1(d.count))
        .attr("width", d => histogramXScale1(d.bin.x1) - histogramXScale1(d.bin.x0))
        .attr("height", (d) => height/2 - histogramYScale1(d.count))
    H2Overlay.selectAll("rect")
        .data(filteredHistogtam2Data)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => histogramXScale2(d.bin.x0))
        .attr("y", (d) => histogramYScale2(d.count))
        .attr("width", d => histogramXScale2(d.bin.x1) - histogramXScale2(d.bin.x0))
        .attr("height", (d) => height/2 - histogramYScale2(d.count))
    H3Overlay.selectAll("rect")
        .data(filteredHistogtam3Data)
        .join("rect")
        .attr("class", "brushed")
        .attr("x", (d) => histogramXScale3(d.bin.x0))
        .attr("y", (d) => histogramYScale3(d.count))
        .attr("width", d => histogramXScale3(d.bin.x1) - histogramXScale3(d.bin.x0))
        .attr("height", (d) => height/2 - histogramYScale3(d.count))
    filteredScatter2Data.attr("class", "brushed");
}