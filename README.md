# EPCSAC
This is the offical repository to the Extensible Platform for Cloud Scheduling Algorithm Comparison.

## Overview

The EPCSAC is an online open-source platform developed to help researchers compare scheduling algorithms to allocate tasks into virtual machines inside cloud infrastructures.

When a new algorithm is developed and published, usually it is compared against some famous literature standard algorithms (like the First-Come-First-Served). However, usually is too difficult to compare this new algorithm with other published works and even when this is made, the researchers cannot reproduce the results obtained in the peer-paper.

The EPCSAC comes as a solution to this problem. Using it, researchers can select different configurations to an fictional datacenter and then test how well their algorithm performs. Then, they can compare their performance against other published algorithms inside our database, this way, their research is improved and more data is gathered to help in the analysis of this new algorithm.

## User Usage

The researcher (main user) will face the initial screen of the platform, where he can create a new account of login into an existing account. When creating a new account, the researcher needs to confirm his e-mail by cliking a link that was sent to him.

### Configuration of simulation parameters

The first step to run a simulation is define the parameters of the simulation. Each parameter can be set to a fixed value or randomized between two bounds, accordingly to the desires of the researcher.

![EPCSAC Configure Page](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/configure.png "EPCSAC Configure Page")

### Algorithm Upload

The researcher can upload an unlimited amount of algorithms, an define new versions for each one, allowing him to use the platform as versiong platform, though it is not the main purpose of the platform.

![EPCSAC Algorithm Upload Page](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/algorithm_upload.png "EPCSAC Algorithm Upload Page")

Also, the user can inform if the algorithm was published and then add the DOI of the article.

### Algorithm Simulation

The researcher can simulate an algorithm they uploaded with a set of parameters they created. 

![EPCSAC Algorithm Simulation Page](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/simulation.png "EPCSAC Algorithm Simulation Page")

### Comparison Simulation

The user can also compare an algorithm he uploaded with a published algorithm, using the parameters of the publication or a set of parameters that he created. This allows the results of both algorithms to be compared.

![EPCSAC Algorithm Compare Page](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/simulation_compare.png "EPCSAC Algorithm Compare Page")

### Results Examples

The simulation can take a while to run. So, when the simulation is done, the user will receive an e-mail with a link to download an log file with the compilation of the program and a csv with the results of the simulation that was done.

## Infrastructure

### General Structure

![EPCSAC Infrastructure](https://github.com/TNanukem/EPCSAC/blob/master/src/public/images/EPCSAC_General_Structure.png "EPCSAC Infrastructure")

## Contributing
You're welcome to contribute to this project. However, we request that you first read the contributing guide in order to know how you can help this project to grow.
