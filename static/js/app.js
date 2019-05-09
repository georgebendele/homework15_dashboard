  
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  async function buildMetadata(sample) {
    /* data route */
    const url = "/metadata/" + sample;
    console.log(url)
    const response = await d3.json(url);
    console.log(response);

    const data = response;
    // Use d3 to select the panel with id of `#sample-metadata`
    const sampleArea = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sampleArea.html('');

    for (key in response){
      console.log(key, response[key]);
    }

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (key in response){
      const row = sampleArea.append("tr");
      const label = row.append("td");
      label.text(`${key}: `);
      const cell = row.append("td");
      cell.text(response[key]);
    }
    document.getElementById("sample-metadata").style.fontSize = "small"; 
}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


  // @TODO: Use `d3.json` to fetch the sample data for the plots
  async function buildCharts(sample) {
  const sample_url = "/samples/" + sample;
  console.log(sample_url)
  const response = await d3.json(sample_url);
  console.log(response);

    function transform(object) {
      var result = [];
      for (var i = 0; i < object.otu_ids.length; i++) {
        result.push({
          otu_ids: object.otu_ids[i],
          otu_labels: object.otu_labels[i],
          sample_values: object.sample_values[i]
        });
      }
      return result;
    }
  
  var list = transform(response);

  console.log(list);

  function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

    // @TODO: Build a Bubble Chart using the sample data
    var sample_bubble = getFields(list, "sample_values");
    var id_bubble = getFields(list, "otu_ids");
    var label_bubble = getFields(list, "otu_labels");

    var trace1 = {
      x: id_bubble,
      y: sample_bubble,
      mode: 'markers',
      text: label_bubble,
      marker: {
        size: sample_bubble,
        color: id_bubble
      }
 
    };
    
    var bubbleData = [trace1];
    
    var bubbleLayout = {
      title: 'Bubble Chart',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.plot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    tops = list.sort(function(a, b){return b.sample_values-a.sample_values});
    let topSamples = tops.slice(0, 10);
    console.log(topSamples);
  
  var sample_result = getFields(topSamples, "sample_values");
  var id_result = getFields(topSamples, "otu_ids");
  var label_result = getFields(topSamples, "otu_labels");

    const pieData = [{
      values: sample_result,
      labels: id_result,
      type: "pie",
      hovertext: label_result,
      hoverinfo: "hovertext"
    }];

    pieData.hoverinfo = 'test';

    const pieLayout = {
      title: 'Pie Chart',
      height: 400,
      width: 600
    };

    Plotly.plot("pie", pieData, pieLayout);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
