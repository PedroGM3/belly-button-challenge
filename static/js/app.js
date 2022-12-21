
// Get the samples json
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


function populateSelector() {
// Fetch the JSON data 
d3.json(samples).then(function(data) {

    console.log(data);
    idList = data.names

    // Use D3 to select the drop down
    let selData = d3.select("#selDataset");

    for (let i = 0; i < idList.length; i++) {
        // Append option list
        selData.append("option").text(idList[i]).property("value", idList[i]);
    }
});

}

// function to create the dem table

function demInfo(selectedID) {

    d3.json(samples).then(function(data) {

    let panelData = d3.select("#sample-metadata");
    currentData = data.metadata.filter(patient => patient.id == selectedID)[0];
    console.log(data.metadata.filter(patient => patient.id == selectedID)[0]);
    panelData.html("");
    Object.entries(currentData).forEach(([key, value]) => {
        panelData.append("p").text(`${key.toUpperCase()}: ${value}`)

    })
    })
}

// function to create charts

function charts(selectedID) {


    d3.json(samples).then(function(data) {
    // I need data for top 10 OTUs for individual sample_values = data for the bar
    // otu_ids = labels
    // otu_labels = hovertext

        
        // filter based on the current selection: Sample and MetaData
        let currentSample = data.samples.filter(patient => patient.id == selectedID)[0];
        let currentMetaData = data.metadata.filter(patient => patient.id == selectedID)[0];

        // // Slice the first 10 objects for plotting
        // // Reverse the array to accommodate Plotly's defaults

        // Trace for the Data
        let trace1 = {
        y: currentSample.otu_ids.slice(0, 10).map(otu_id => `OTU #${otu_id}`).reverse(),
        x: currentSample.sample_values.slice(0, 10).reverse(),
        text: currentSample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        };

        // Data trace array
        let traceData = [trace1];

        // Apply title to the layout
        let layout = {
        title: { text: "<b>Top 10 OTUs found in selected individual</b>" }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", traceData, layout);


        // Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        var trace2 = {
            x: currentSample.otu_ids,
            y: currentSample.sample_values,
            text: currentSample.otu_labels,
            mode: 'markers',
            marker: {
                color: currentSample.otu_ids,
                colorscale: "thermal",
                size: currentSample.sample_values
            }
          };
          
          var data1 = [trace2];
          
          var layout2 = {
            title: { text: "<b>Sample Data</b>" },
            showlegend: false,
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', data1, layout2);




          // Create gauge chart

        

        var dataGauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: currentMetaData.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 10] } }
            }
        ];
            console.log(currentMetaData.wfreq);
            var layout3 = { width: 600, height: 400 };
            Plotly.newPlot('gauge', dataGauge, layout3);
    });



}


// function for when the drop down is changed
function optionChanged(selectedID) {
    console.log(selectedID);
    charts(selectedID);
    demInfo(selectedID);
}


// run initializer 
function init() {
    d3.json(samples).then(function(data) {
    
    populateSelector();
    demInfo(data.names[0]);
    charts(data.names[0]);
    })
}

init();
