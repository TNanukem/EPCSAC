function plot(){

    // Average value of the arrays
    const average = list => list.reduce((prev, curr) => prev + curr) / list.length;

    var mean_responseTime = [];
    // Average execution time
    for (i = 0; i < responseTime.length; i++) {
        mean_responseTime.push(average(responseTime[i]));
    }

    var mean_execTime = [];
    // Average execution time
    for (i = 0; i < execTime.length; i++) {
        mean_execTime.push(average(execTime[i]));
    }

    // Verifies flag
    aggregate = document.getElementById('aggregation');
    console.log(aggregate.checked);
    if(aggregate.checked){

        // Creates new alg_names list
        new_names = []
        for (i = 0; i < alg_names.length; i++) {
            if(new_names.includes(alg_names[i].slice(0,-1))){
                continue
            }
            new_names.push(alg_names[i].slice(0, -1))
        }
        
        values = {};

        // Iterate for each algorithm to find the averages
        for(i = 0; i < new_names.length; i++){
            values[new_names[i]] = [];

            averages_exec = [];
            averages_response = [];
            averages_success = [];
            averages_failures = [];

            for(j = 0; j < alg_names.length; j++){
                if (alg_names[j].slice(0, -1) == new_names[i]){
                    averages_success.push(success[j]);
                    averages_failures.push(failure[j]);
                    averages_exec.push(mean_execTime[j]);
                    averages_response.push(mean_responseTime[j]);
                }
            }
            values[new_names[i]].push(average(averages_success));
            values[new_names[i]].push(average(averages_failures));
            values[new_names[i]].push(average(averages_exec));
            values[new_names[i]].push(average(averages_response));
        }
        alg_names_ = new_names;

        success_ = [];
        failure_ = [];
        mean_responseTime_ = [];
        mean_execTime_ = [];

        for(i = 0; i < new_names.length; i++){
            success_.push(values[new_names[i]][0]);
            failure_.push(values[new_names[i]][1]);
            mean_execTime_.push(values[new_names[i]][2]);
            mean_responseTime_.push(values[new_names[i]][3]);
        }
    }

    else {
        var alg_names_ = alg_names;

        var success_ = success;
        var failure_ = failure;
        var mean_responseTime_ = mean_responseTime;
        var mean_execTime_ = mean_execTime;
    }
    
    // Proportion of success
    LOCAL = document.getElementById('prop-success');

    var trace1 = {
        x: alg_names_,
        y: success_,
        name: 'SUCCESS',
        type: 'bar'
    };

    var trace2 = {
        x: alg_names_,
        y: failure_,
        name: 'FAILURE',
        type: 'bar'
    };

    var data = [trace1, trace2];
    var layout = {barmode: 'group'};

    Plotly.newPlot(LOCAL, data, layout);
    
    LOCAL = document.getElementById('cloudlet-time');

    Plotly.newPlot(LOCAL, [{
        x: alg_names_,
        y: mean_execTime_,
        type: 'bar'
    }], {
        margin: { t: 0 },
        xaxis: {title: "Algorithm"},
        yaxis: { title: "Mean Execution Time (s)"},
    });

    LOCAL = document.getElementById('response-time');
    Plotly.newPlot(LOCAL, [{
        x: alg_names_,
        y: mean_responseTime_,
        type: 'bar'
    }], {
        margin: { t: 0 },
        xaxis: { title: "Algorithm" },
        yaxis: { title: "Mean Response Time (s)" },
    });
    
}
