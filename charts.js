function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSmap = sampleArray.filter(samp0 => samp0.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filterMeta = data.metadata.filter(metaSam => metaSam.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var filt = filterSmap[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaFilt = filterMeta[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var idVar = filt.otu_ids;
    console.log(idVar);
    var lableVar = filt.otu_labels;
    console.log(lableVar);
    var valueVar = filt.sample_values;
    console.log(valueVar);

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metaFilt.wfreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 

    var yticks = idVar.slice(0,10).reverse();
    console.log(yticks);
    var xticks = valueVar.slice(0,10).reverse();
    console.log(xticks);

    //var hover = lableVar.slice(0,10);
    //console.log(hover);

    // 8. Create the trace for the bar chart. s
    var barData = {
      x: xticks,
      y: yticks,
      type: "bar",
      //text: hover
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: idVar,
      y: valueVar,
      //text: labelVar,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 4000,
        color: 'rgb(128, 0, 128)',
        colorscale: 'Picnic',
      }
    };
   
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" }, 
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: {color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}