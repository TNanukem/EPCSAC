![EPCSAC Loog](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/logo.png "EPCSAC Logo")

# Overview

The EPCSAC (Extensible Platform for Cloud Scheduling Algorithm Comparison) is an online open-source platform developed to help researchers compare scheduling algorithms to allocate tasks into virtual machines inside cloud infrastructures.

The comparison between two different proposed scheduling algorithms is difficult, not to say impossible. This happens for several reasons like the unavailability of the source code for the algorithm proposed by a peer, the lack of data on the inputs asserted into this algorithm and the configurations of the simulation software itself. Also, in several cases, these researchers focus on only one aspect of the algorithm, like time efficiency or energy consumption and each new research requires the researcher to implement by itself the infrastructure of the simulation, reducing the time available to the focus of the research: studying the scheduling algorithm

This leads to several papers where new scheduling algorithms proposed are compared only to algorithms developed by the same researcher or some classic algorithms from the literature, like the FCFS (First Come, First Serve) algorithm.

This reduces the potential for a real comparison between these algorithms in a way that one cannot truly know if some algorithm performs better than the other, and if so, how and why does that happen.

To solve this problem and make the research process easier for the researchers, we propose the EPCSAC (Extensible Platform for Cloud Scheduling Algorithm Comparison), a web service based on the SaaS model that provides the simulation infrastructure required for researchers to test their algorithms.

The development of the project is done primarly by [Tiago Toledo Jr](https://github.com/TNanukem), a student and researcher at University of São Paulo.

# Main Features

As of today, researchers are capable of using the EPCSAC to:

- Create a set of simulation parameters to be used on the simulations.
- Upload scheduling algorithms to the platform.
- Simulate their algorithms using a set of parameters.
- Comparing the results of their algorithms with other algorithms on the platform.
- Seeing the comparative results on an online dashboard.

# Under development

The immediate next steps of development are:

- Improved reproducibility and metrics of results.
- Users and algorithms pages. 
- Unit tests creation.
- Refactor of the code.

After all these steps are concluded, version 1.0 will be released.

# Contributing

You're welcome to contribute to this project. However, we request that you first read the [Contributing Guide](https://github.com/TNanukem/EPCSAC/blob/master/CONTRIBUTING.md) in order to know how you can help this project to grow.

<!--# Documentation and FAQ-->

<!--# Publications-->
