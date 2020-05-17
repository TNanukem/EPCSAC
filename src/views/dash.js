function plot(){

    var failure = cloudlet.length - success;

    TESTER = document.getElementById('prop-success');
    var trace1 = {
        x: [1],
        y: [success],
        name: 'SUCCESS',
        type: 'bar'
    };

    var trace2 = {
        x: [1],
        y: [failure],
        name: 'FAILURE',
        type: 'bar'
    };

    var data = [trace1, trace2];
    var layout = {barmode: 'group'};

    Plotly.newPlot(TESTER, data, layout);

    TESTER = document.getElementById('cloudlet-time');
    Plotly.newPlot(TESTER, [{
        x: cloudlet,
        y: execTime,
        type: 'bar'
    }], {
        margin: { t: 0 },
        xaxis: {title: "Cloudlet id"},
        yaxis: { title: "Execution time (s)"},
    });

    TESTER = document.getElementById('response-time');
    var trace = {
        x: responseTime,
        type: 'histogram',
    };
    var layout = {
        margin: { t: 0 },
        xaxis: { title: 'Response time (s)' },
    }
    var data = [trace]
    Plotly.newPlot(TESTER, data, layout);
}
