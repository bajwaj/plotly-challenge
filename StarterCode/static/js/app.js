// initization function [ID] everytime we open the page the dropdown will be populated (interactive, values from dataset) this function willc all other functions
// build metadata function [Demographic] (call in metadata) on left popultae patient info
// build chart functions
// repopluation charts function with new sample id (html referred to optionchanged line 25)


function buildMetadata(sample){
    // we need to tell our script what to filter
    d3.json("samples.json").then((data) => {
        //what dataset to filter by
        var metadata = data.metadata;
        //create array to hold filtered results
        var demoArray = metadata.filter(demoInfo => demoInfo.id == sample)[0];
        console.log(demoArray);
        // var demo = demoArray[0]
        // info table
        var inputElement = d3.select("#sample-metadata");
        //use .html("") to clear out previous data and make room for next input
        inputElement.html("");
        Object.entries(demoArray).forEach(([key, value]) => {
            inputElement.append("h6").text(`${key}: ${value}`);
        });
    });

}


function buildCharts(sample){
    // read in data, access the sample data
    d3.json("samples.json").then((data) => {
    // filter by that sample (same as above to filter)
        var samples = data.samples;
        var demoArray = samples.filter(demoInfo => demoInfo.id == sample);
    // use array for example 'result' array and reference the variabvles like result.OTU_ids
        var result = demoArray[0];
    // we want OTU ids, OTU labels and sample values (can save to variables to make it easier to access)
        var otuIds = result.otu_ids;
        console.log(otuIds)
        var otuLabels  = result.otu_labels;
        console.log(otuLabels)
        var sampleValues = result.sample_values;
        console.log(sampleValues)
    
    // build out new plot with plotly, set up bubble chart (formatting and pass through data)
    // bubble chart
    var trace1 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
        size: sampleValues,
        color: otuIds,
        }
    };
    var data = [trace1];
    var layout = {
        showlegend: false,
    };
    Plotly.newPlot('bubble', data, layout); 



    // build horizontal bar chart (reverese order of data when re-orientating the chart) map the data and then reverse the data (function .map and .reverse used)
    var trace2 = {
        x: sampleValues.slice(0,10).reverse(),
        y: otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        marker: {
            color: 'blue'},
            type: "bar",
            orientation: "h"
        };
    var data =[trace2];
    var layout = {

    };
    Plotly.newPlot("bar", data, layout); 
    });
}


function init(){
    //populate dropdown with ids from 'name' key
    var select = d3.select("#selDataset");
    //arrow function to read in data append text and value to the dropdown
    d3.json("samples.json").then((data) => {
        //this is the array of ids under 'name' in the json file
        var names = data.names;
        names.forEach((sample) => {
            //.property used to be able to use it again
            select.append("option").text(sample).property("value", sample)
        }); 
    var firstSample = names[0];
    //use first sample to build plots when page renders (reloads)
    buildCharts(firstSample);
    buildMetadata(firstSample); 
    });
}

// function optionChanged- repopluation charts function with new sample id (html referred to optionchanged line 25) simple as calling the teo functions above

function optionChanged(newId) {
    buildCharts(newId);
    buildMetadata(newId); 
}

init();