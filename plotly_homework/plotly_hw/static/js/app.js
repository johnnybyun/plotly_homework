url = 'http://127.0.0.1:5000/'

d3.json(url).then(function(data){
    // We create a function that creates the drop down menu options iteratively from the array 'data.names'
    function createDropdownOptions() {
        // Sets the default value for the dropdown menu as the first element in the array
        var dropdownOptions = "<option value="+data.names[0]+">"+data.names[0]+"</option>";
        // Loops through the data.names array to create an <option> element for each value in data.names
        for (var i = 1; i < data.names.length; i++) {
            dropdownOptions += "<option value="+data.names[i]+">"+data.names[i]+"</option>";
        }
        // Inserts our generated list of <option> tags inside the select element for the dropdown, whose id is selDataset.
        document.getElementById('selDataset').innerHTML = dropdownOptions;
    }
    // Finally we call the function to generate the dropdown options and place them inside the <select> element with id 'selDataset'
    createDropdownOptions();

    // Create an array of Keys for the key:value pairs in the demographic <panel> element
    var metadataKeys = Object.keys(data.metadata[0]);

    // We create an init function to render the page with some initial values.
    function init() {

    // Initial metadata for 'Demographic Info' panel
        var id = "id: " + data.metadata[0]['id'];
        var ethnicity = "ethnicity: " + data.metadata[0]['ethnicity'];
        var gender = "gender: " + data.metadata[0]['gender'];
        var age = "age: " + data.metadata[0]['age'];
        var location = "location: " + data.metadata[0]['location'];
        var bbtype = "bbtype: " + data.metadata[0]['bbtype'];
        var wfreq = "wfreq: " + data.metadata[0]['wfreq'];
    // 'Demographic Info' Panel
        document.getElementById('metaPanelId').innerHTML = id;
        document.getElementById('metaPanelEthnicity').innerHTML = ethnicity;
        document.getElementById('metaPanelGender').innerHTML = gender;
        document.getElementById('metaPanelAge').innerHTML = age;
        document.getElementById('metaPanelLocation').innerHTML = location;
        document.getElementById('metaPanelBbtype').innerHTML = bbtype;
        document.getElementById('metaPanelWfreq').innerHTML = wfreq;

    // Initial sample data for bar chart
        var sample = data.samples[0];
        otu_labels_slice = sample.otu_labels.slice(0, 10).reverse();
        otu_sample_values_slice = sample.sample_values.slice(0, 10).reverse();
        // we format the OTU ids to match the example
        otu_ids_slice = sample.otu_ids.slice(0, 10).reverse();
        formatted_otu_labels = otu_ids_slice.map((otu => "OTU " + otu));

    // Plot for bar chart
        var trace1 = {
            type: 'bar',
            x: otu_sample_values_slice,
            y: formatted_otu_labels,
            text: otu_labels_slice,
            orientation: 'h'
        };

        var d = [trace1];

        var layout = {
          margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 0
          }
        };

        Plotly.newPlot("bar", d, layout);

    // Plot for bubble chart
        var trace2 = {
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                color: sample.otu_ids,
                opacity: sample.otu_ids,
                size: sample.sample_values
            }
        };

        var d2 = [trace2];

        var layout2 = {
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble", d2, layout2);

    // Plot for gauge chart
        var d4 = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: data.metadata[0]['wfreq'],
            title: { text: "Washing Frequency", font: { size: 24 } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "green" },
              bar: { color: "green" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 1], color: 'rgb(215,48,39)' },
                { range: [1, 2], color: 'rgb(244,109,67)' },
                { range: [2, 3], color: 'rgb(253,174,97)' },
                { range: [3, 4], color: 'rgb(254,224,144)'},
                { range: [4, 5], color: 'rgb(224,243,248)'},
                { range: [5, 6], color: 'rgb(171,217,233)'},
                { range: [6, 7], color: 'rgb(116,173,209)'},
                { range: [7, 8], color: 'rgb(69,117,180)'},
                { range: [8, 9], color: 'rgb(49,54,149)'}
              ],
            }
          }
        ];

        var layout4 = {
          width: 500,
          height: 400,
          margin: { t: 25, r: 75, l: 0, b: 25 },
          // paper_bgcolor: "lavender",
          font: { color: "darkblue", family: "Arial" }
        };

        Plotly.newPlot('gauge', d4, layout4);
    }

    // Create an event listener / handler that updates the data and content for our plots and metadata panel
    d3.selectAll("#selDataset").on("change", getData);
    // updatePlotly updates the plot based on the dropdown menu value
    function getData() {
        // here we select the entire dropdown menu with all of its options
        // in previous examples we selected just the node as var dropDownNode = d3.select(#selectDataset).node()
        // here we select the dropdownMenu and assign it to the
        var dropdownMenu = d3.select("#selDataset");
        // .property assigns the dropdown menu 'value' to 'idValue'.
        // the possible values of 'value' are 940, 941,... as generated by our in line 8.
        var idValue = dropdownMenu.property("value");
        // Update the values in demographic panel
        for (var i = 0; i < data.names.length; i++) {
            if (data.names[i] === idValue) {
                id = "id: " + data.metadata[i]['id'];
                ethnicity = "ethnicity: " + data.metadata[i]['ethnicity'];
                gender = "gender: " + data.metadata[i]['gender'];
                age = "age: " + data.metadata[i]['age'];
                loc = "location: " + data.metadata[i]['location'];
                bbtype = "bbtype: " + data.metadata[i]['bbtype'];
                wfreq = "wfreq: " + data.metadata[i]['wfreq'];
                document.getElementById('metaPanelId').innerHTML = id;
                document.getElementById('metaPanelEthnicity').innerHTML = ethnicity;
                document.getElementById('metaPanelGender').innerHTML = gender;
                document.getElementById('metaPanelAge').innerHTML = age;
                document.getElementById('metaPanelLocation').innerHTML = loc;
                document.getElementById('metaPanelBbtype').innerHTML = bbtype;
                document.getElementById('metaPanelWfreq').innerHTML = wfreq;
                break;
            }
        }
        var sample = data.samples[i];
        console.log("sample is ", sample);
        otu_labels_slice = sample.otu_labels.slice(0, 10).reverse();
        otu_sample_values_slice = sample.sample_values.slice(0, 10).reverse();
        // we format the OTU ids to match the example
        otu_ids_slice = sample.otu_ids.slice(0, 10).reverse();
        formatted_otu_labels = otu_ids_slice.map((otu => "OTU " + otu));
        update = {};

        var trace1 = {
            type: 'bar',
            x: otu_sample_values_slice,
            y: formatted_otu_labels,
            text: otu_labels_slice,
            orientation: 'h'
        };

        var d = [trace1];

        var layout = {
          margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 0
          }
        };

        console.log("update is ", trace1);

        Plotly.newPlot("bar", d, layout);

        var trace2 = {
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                color: sample.otu_ids,
                opacity: sample.otu_ids,
                size: sample.sample_values
            }
        };

        var d2 = [trace2];

        var layout2 = {
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble", d2, layout2);

    // Plot for gauge chart
        var d4 = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: data.metadata[i]['wfreq'],
            title: { text: "Washing Frequency", font: { size: 24 } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 1], color: 'rgb(215,48,39)' },
                { range: [1, 2], color: 'rgb(244,109,67)' },
                { range: [2, 3], color: 'rgb(253,174,97)' },
                { range: [3, 4], color: 'rgb(254,224,144)'},
                { range: [4, 5], color: 'rgb(224,243,248)'},
                { range: [5, 6], color: 'rgb(171,217,233)'},
                { range: [6, 7], color: 'rgb(116,173,209)'},
                { range: [7, 8], color: 'rgb(69,117,180)'},
                { range: [8, 9], color: 'rgb(49,54,149)'}
              ],
            }
          }
        ];

        var layout4 = {
          width: 500,
          height: 400,
          margin: { t: 25, r: 75, l: 0, b: 25 },
          // paper_bgcolor: "lavender",
          font: { color: "darkblue", family: "Arial" }
        };

        Plotly.newPlot('gauge', d4, layout4);

    }
    // function updatePlotly(newdata) {
    //     // Plotly.restyle("bar", "x", [newdata])
    //     Plotly.newPlot("bar", d, layout);
    // }
    init();
})

