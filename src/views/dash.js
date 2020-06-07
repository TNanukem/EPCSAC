function plot(){

    // Average value of the arrays
    const average = list => list.reduce((prev, curr) => prev + curr) / list.length;

    // Proportion of success
    TESTER = document.getElementById('prop-success');

    var trace1 = {
        x: alg_names,
        y: success,
        name: 'SUCCESS',
        type: 'bar'
    };

    var trace2 = {
        x: alg_names,
        y: failure,
        name: 'FAILURE',
        type: 'bar'
    };

    var data = [trace1, trace2];
    var layout = {barmode: 'group'};

    Plotly.newPlot(TESTER, data, layout);

    var mean_execTime = [];
    // Average execution time
    for(i = 0; i < execTime.length; i++){
        mean_execTime.push(average(execTime[i]));
    }
    
    TESTER = document.getElementById('cloudlet-time');

    Plotly.newPlot(TESTER, [{
        x: alg_names,
        y: mean_execTime,
        type: 'bar'
    }], {
        margin: { t: 0 },
        xaxis: {title: "Algorithm"},
        yaxis: { title: "Mean Execution Time (s)"},
    });

    var mean_responseTime = [];
    // Average execution time
    for (i = 0; i < responseTime.length; i++) {
        mean_responseTime.push(average(responseTime[i]));
    }

    TESTER = document.getElementById('response-time');
    Plotly.newPlot(TESTER, [{
        x: alg_names,
        y: mean_responseTime,
        type: 'bar'
    }], {
        margin: { t: 0 },
        xaxis: { title: "Algorithm" },
        yaxis: { title: "Mean Response Time (s)" },
    });
    
}
