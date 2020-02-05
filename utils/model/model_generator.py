import sys
import ast

parametersList = ast.literal_eval(sys.argv[1])
print(parametersList)

# parametersList = [5, 3, 'false', '2', '1', 'false', '2', '1', 'false', '2',
# '1', 'false','2', '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1',
# 'false', '2', '1', 'false','2', '1', 'false', '2', '1', 'false', '2', '1',
# 'false', '2', '1', 'false', '2', '1', 'false']

file = open('model_aux.java', 'w+')

text = """

package org.cloudsimplus.examples.schedulers;

import org.cloudbus.cloudsim.allocationpolicies.VmAllocationPolicySimple;
import org.cloudbus.cloudsim.brokers.DatacenterBroker;
import org.cloudbus.cloudsim.brokers.DatacenterBrokerSimple;
import org.cloudbus.cloudsim.cloudlets.Cloudlet;
import org.cloudbus.cloudsim.cloudlets.CloudletSimple;
import org.cloudbus.cloudsim.core.CloudSim;
import org.cloudbus.cloudsim.datacenters.Datacenter;
import org.cloudbus.cloudsim.datacenters.DatacenterSimple;
import org.cloudbus.cloudsim.hosts.Host;
import org.cloudbus.cloudsim.hosts.HostSimple;
import org.cloudbus.cloudsim.provisioners.PeProvisionerSimple;
import org.cloudbus.cloudsim.provisioners.ResourceProvisioner;
import org.cloudbus.cloudsim.provisioners.ResourceProvisionerSimple;
import org.cloudbus.cloudsim.resources.Pe;
import org.cloudbus.cloudsim.resources.PeSimple;
import org.cloudbus.cloudsim.schedulers.cloudlet.CloudletSchedulerSpaceShared;
import org.cloudbus.cloudsim.schedulers.vm.VmScheduler;
import org.cloudbus.cloudsim.schedulers.vm.VmSchedulerTimeShared;
import org.cloudbus.cloudsim.utilizationmodels.UtilizationModel;
import org.cloudbus.cloudsim.utilizationmodels.UtilizationModelFull;
import org.cloudbus.cloudsim.vms.Vm;
import org.cloudbus.cloudsim.vms.VmSimple;
import org.cloudsimplus.builders.tables.CloudletsTableBuilder;
import org.cloudsimplus.builders.tables.CsvTable;

import java.io.IOException;
import java.io.PrintStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class modelo {{
    // Number of iterations
    private static final int ITERATIONS = {};

    // Exact Values
    private static final int DATACENTER_EXACT = {};
    private static final int HOSTS_EXACT = {};
    private static final int HOSTS_PES_EXACT = {};
    private static final int HOSTS_RAM_EXACT = {};
    private static final int HOSTS_BW_EXACT = {};
    private static final int HOSTS_HD_EXACT = {};
    private static final int VMS_EXACT = {};
    private static final int VM_PES_EXACT = {};
    private static final int VM_RAM_EXACT = {};
    private static final int VM_BW_EXACT = {};
    private static final int VM_HD_EXACT = {};
    private static final int CLOUDLETS_EXACT = {};
    private static final int CLOUDLETS_PES_EXACT = {};
    private static final int CLOUDLETS_LENGTH_EXACT = {};

    // Number of datacenters
    private static final int DATACENTER_MAX = {};
    private static final int DATACENTER_MIN = {};
    private static final boolean DATACENTER_FLAG = {};

    // Number of hosts inside a datacenter
    private static final int HOSTS_MAX = {};
    private static final int HOSTS_MIN = {};
    private static final boolean HOSTS_FLAG = {};

    // Number of processing units inside each host
    private static final int HOST_PES_MAX = {};
    private static final int HOST_PES_MIN = {};
    private static final boolean HOSTS_PES_FLAG = {};

    // RAM of each Host
    private static final int HOST_RAM_MAX = {};
    private static final int HOST_RAM_MIN = {};
    private static final boolean HOSTS_RAM_FLAG = {};

    // BW of each Host
    private static final int HOST_BW_MAX = {};
    private static final int HOST_BW_MIN = {};
    private static final boolean HOSTS_BW_FLAG = {};

    // HD of each host
    private static final int HOST_HD_MAX = {};
    private static final int HOST_HD_MIN = {};
    private static final boolean HOSTS_HD_FLAG = {};

    // Number of VMs inside the datacenter
    private static final int VMS_MAX = {};
    private static final int VMS_MIN = {};
    private static final boolean VMS_FLAG = {};

    // Number of processing units inside each VM
    private static final int VM_PES_MAX = {};
    private static final int VM_PES_MIN = {};
    private static final boolean VMS_PES_FLAG = {};

    // RAM of each VM
    private static final int VM_RAM_MAX = {};
    private static final int VM_RAM_MIN = {};
    private static final boolean VMS_RAM_FLAG = {};

    // BW of each VM
    private static final int VM_BW_MAX = {};
    private static final int VM_BW_MIN = {};
    private static final boolean VMS_BW_FLAG = {};

    // HD of each VM
    private static final int VM_HD_MAX = {};
    private static final int VM_HD_MIN = {};
    private static final boolean VMS_HD_FLAG = {};

    // Number of cloudlets (tasks)
    private static final int CLOUDLETS_MAX = {};
    private static final int CLOUDLETS_MIN = {};
    private static final boolean CLOUDLETS_FLAG = {};

    // Number of processing units necessary to run each cloudlet (task)
    private static final int CLOUDLET_PES_MAX = {};
    private static final int CLOUDLET_PES_MIN = {};
    private static final boolean CLOUDLETS_PES_FLAG = {};

    // The lenght of each cloudlet (task)
    private static final int CLOUDLET_LENGTH_MAX = {};
    private static final int CLOUDLET_LENGTH_MIN = {};
    private static final boolean CLOUDLET_LENGTH_FLAG = {};

    private CloudSim simulation;
    private DatacenterBroker broker0;
    private List<Vm> vmList;
    private List<Cloudlet> cloudletList;
    private Datacenter datacenter0;

    private String ALGORITHM_NAME = "exemplo";

    public static void main(String[] args) {{
        new modelo();
    }}

    private modelo() {{
        /*Enables just some level of log messages.
          Make sure to import org.cloudsimplus.util.Log;*/
        //Log.setLevel(ch.qos.logback.classic.Level.WARN);

        for (int it = 1; it <= ITERATIONS; it++) {{
        	simulation = new CloudSim();
            datacenter0 = createDatacenter();

            //Creates a broker that is a software acting on behalf a cloud customer to manage his/her VMs and Cloudlets
            broker0 = new DatacenterBrokerSimple(simulation);

            vmList = createVms();
            cloudletList = createCloudlets();
            broker0.submitVmList(vmList);
            broker0.submitCloudletList(cloudletList);

            simulation.start();

            List<Cloudlet> finishedCloudlets = broker0.getCloudletFinishedList();
            //new CloudletsTableBuilder(finishedCloudlets).build();

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy_MM_dd_HH_mm_ss");
            LocalDateTime now = LocalDateTime.now();
            String time = dtf.format(now);

            String local = "/home/tiago/Downloads/" + ALGORITHM_NAME + "_" + it + "_results_" + time + ".csv";
            System.out.println(it);
            try {{
                CsvTable csv = new CsvTable();
                csv.setPrintStream(new PrintStream(new java.io.File(local)));
                new CloudletsTableBuilder(broker0.getCloudletFinishedList(), csv).build();
            }} catch (IOException e) {{
                System.err.println(e.getMessage());
            }}
        }}
    }}

    // Generates a random number between two ints or return the max number
    private int generateRandomNumber(int exact, int max, int min, boolean flag){{
      if(flag == false){{
        return exact;
      }}
      Random r = new Random();
      return r.nextInt(max-min+1) + min;
    }}


    // Creates a Datacenter and its Hosts.
    private Datacenter createDatacenter() {{
    	int HOSTS = generateRandomNumber(HOSTS_EXACT, HOSTS_MAX, HOSTS_MIN, HOSTS_FLAG);
        final List<Host> hostList = new ArrayList<>(HOSTS);
        for(int h = 0; h < HOSTS; h++) {{
            Host host = createHost();
            hostList.add(host);
        }}

        final Datacenter dc = new DatacenterSimple(simulation, hostList, new VmAllocationPolicySimple());
        return dc;
    }}

    private Host createHost() {{
    	int HOST_PES = generateRandomNumber(HOSTS_PES_EXACT, HOST_PES_MAX, HOST_PES_MIN, HOSTS_PES_FLAG);
        List<Pe> peList = new ArrayList<>(HOST_PES);
        //List of Host's CPUs (Processing Elements, PEs)
        for (int i = 0; i < HOST_PES; i++) {{
            peList.add(new PeSimple(1000, new PeProvisionerSimple()));
        }}

        final long ram = generateRandomNumber(HOSTS_RAM_EXACT, HOST_RAM_MAX, HOST_RAM_MIN, HOSTS_RAM_FLAG); //in Megabytes
        final long bw = generateRandomNumber(HOSTS_BW_EXACT, HOST_BW_MAX, HOST_BW_MIN, HOSTS_BW_FLAG); //in Megabytes; //in Megabits/s
        final long storage = generateRandomNumber(HOSTS_HD_EXACT, HOST_HD_MAX, HOST_HD_MIN, HOSTS_HD_FLAG); //in Megabytes; //in Megabytes
        ResourceProvisioner ramProvisioner = new ResourceProvisionerSimple();
        ResourceProvisioner bwProvisioner = new ResourceProvisionerSimple();
        VmScheduler vmScheduler = new VmSchedulerTimeShared();
        Host host = new HostSimple(ram, bw, storage, peList);
        host
            .setRamProvisioner(ramProvisioner)
            .setBwProvisioner(bwProvisioner)
            .setVmScheduler(vmScheduler);
        return host;
    }}

    // Creates a list of VMs
    private List<Vm> createVms() {{
    	int VMS = generateRandomNumber(VMS_EXACT, VMS_MAX, VMS_MIN, VMS_FLAG);
        final List<Vm> list = new ArrayList<>(VMS);
        for (int v = 0; v < VMS; v++) {{
        	int VM_PES = generateRandomNumber(VM_PES_EXACT, VM_PES_MAX, VM_PES_MIN, VMS_PES_FLAG);
        	int VM_RAM = generateRandomNumber(VM_RAM_EXACT, VM_RAM_MAX, VM_RAM_MIN, VMS_RAM_FLAG);
        	int VM_BW = generateRandomNumber(VM_BW_EXACT, VM_BW_MAX, VM_BW_MIN, VMS_BW_FLAG);
        	int VM_HD = generateRandomNumber(VM_HD_EXACT, VM_HD_MAX, VM_HD_MIN, VMS_HD_FLAG);
            Vm vm =
                new VmSimple(v, 1000, VM_PES)
                    .setRam(VM_RAM).setBw(VM_BW).setSize(VM_HD)
                    .setCloudletScheduler(new CloudletSchedulerSpaceShared());

            list.add(vm);
        }}

        return list;
    }}

    // Creates a list of cloudlets (tasks)
    private List<Cloudlet> createCloudlets() {{
    	int CLOUDLETS = generateRandomNumber(CLOUDLETS_EXACT, CLOUDLETS_MAX, CLOUDLETS_MIN, CLOUDLETS_FLAG);
        final List<Cloudlet> list = new ArrayList<>(CLOUDLETS);
        UtilizationModel utilization = new UtilizationModelFull();
        for (int c = 0; c < CLOUDLETS; c++) {{
        	int CLOUDLET_PES = generateRandomNumber(CLOUDLETS_PES_EXACT, CLOUDLET_PES_MAX, CLOUDLET_PES_MIN, CLOUDLETS_PES_FLAG);
        	int CLOUDLET_LENGTH = generateRandomNumber(CLOUDLETS_LENGTH_EXACT, CLOUDLET_LENGTH_MAX, CLOUDLET_LENGTH_MIN, CLOUDLET_LENGTH_FLAG);
            Cloudlet cloudlet =
                new CloudletSimple(c, CLOUDLET_LENGTH, CLOUDLET_PES)
                    .setFileSize(1024)
                    .setOutputSize(1024)
                    .setUtilizationModel(utilization);
            list.add(cloudlet);
        }}

        return list;
    }}
}}


""".format(*parametersList)

file.write(text)
file.close()
