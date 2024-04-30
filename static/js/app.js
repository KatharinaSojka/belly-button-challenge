// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
  // logging the fetched data
    console.log("Metadata Data:", data);

    // get the metadata field

    let metadata = data.metadata;
    
    //logging metadata

    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number

    let sampleMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    //logging the filtered metadata

    console.log("Filtered Metadata:", sampleMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(sampleMetadata[0]).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((Data) => {

    // Get the samples field

    let sampleInfo = Data.samples;

    // Filter the samples for the object with the desired sample number

    let results = sampleInfo.filter(sampleObj => sampleObj.id == sample);

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = results[0].otu_ids;
    let otu_labels = results[0].otu_labels;
    let sample_values = results[0].sample_values;

    // logging data to the console

    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart

    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }
    let b_data = [bubble_trace];

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: 'OTU ID' // Description for x-axis
      },
      yaxis: {
        title: 'Number of Bacteria' // Description for y-axis
      }
    }
   
    // Render the Bubble Chart

    Plotly.newPlot('bubble', b_data, layout);
    
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // selecting first 10 otu ids, samle values are already sorted descending in the data source
    
    let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_trace = {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h',
      type: 'bar'
    }; 

    let bar_data = [bar_trace];

    let layout_bar = {
      title: 'Top ten Bacteria Cultures Found',
      barmode: 'group'

    }

    // Render the Bar Chart
    Plotly.newPlot('bar', bar_data, layout_bar);
  });
}

// Function to run on page load
function init() {
  console.log('Begin Script'); //testing if script starts

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
      
    for (let i = 0; i < names.length; i++) {
      let sample = names[i];
      dropdownMenu.append("option")
        .text(sample)
        .attr("value", sample);
    };

    // Get the first sample from the list

    let sample_one = names[0];
    
    // Build charts and metadata panel with the first sample
    buildMetadata(sample_one);
    buildCharts(sample_one);
  });
  console.log('Finish Script'); //testing if script ends
  
}

// Function for event listener

function optionChanged(newSample) {

  // logging the sample

  console.log("Selected sample:", newSample);

  // Build charts and metadata panel each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard

init();
