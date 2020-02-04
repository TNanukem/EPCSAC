

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

import java.util.ArrayList;
import java.util.List;

public class CloudletSchedulerSpaceSharedExample1 {
    // Number of datacenters
    private static final int DATACENTER_MAX = ;
    private static final int DATACENTER_MIN = ;
    private static final boolean DATACENTER_FLAG = ;

    // Number of hosts inside a datacenter
    private static final int HOSTS_MAX = ;
    private static final int HOSTS_MIN = ;
    private static final boolean HOSTS_FLAG = ;

    // Number of processing units inside each host
    private static final int HOST_PES_MAX = ;
    private static final int HOST_PES_MIN = ;
    private static final boolean HOSTS_PES_FLAG = ;

    // RAM of each Host
    private static final int HOST_RAM_MAX = ;
    private static final int HOST_RAM_MIN = ;
    private static final boolean HOSTS_RAM_FLAG = ;

    // BW of each Host
    private static final int HOST_BW_MAX = ;
    private static final int HOST_BW_MIN = ;
    private static final boolean HOSTS_BW_FLAG = null;

    // HD of each host
    private static final int HOST_HD_MAX = null;
    private static final int HOST_HD_MIN = false;
    private static final boolean HOSTS_HD_FLAG = null;

    // Number of VMs inside the datacenter
    private static final int VMS_MAX = null;
    private static final int VMS_MIN = false;
    private static final boolean VMS_FLAG = null;

    // Number of processing units inside each VM
    private static final int VM_PES_MAX = null;
    private static final int VM_PES_MIN = false;
    private static final boolean VMS_PES_FLAG = null;

    // RAM of each VM
    private static final int VM_RAM_MAX = null;
    private static final int VM_RAM_MIN = false;
    private static final boolean VMS_RAM_FLAG = null;

    // BW of each VM
    private static final int VM_BW_MAX = null;
    private static final int VM_BW_MIN = false;
    private static final boolean VMS_BW_FLAG = null;

    // HD of each VM
    private static final int VM_HD_MAX = null;
    private static final int VM_HD_MIN = false;
    private static final boolean VMS_HD_FLAG = null;

    // Number of cloudlets (tasks)
    private static final int CLOUDLETS_MAX = null;
    private static final int CLOUDLETS_MIN = false;
    private static final boolean CLOUDLETS_FLAG = null;

    // Number of processing units necessary to run each cloudlet (task)
    private static final int CLOUDLET_PES_MAX = null;
    private static final int CLOUDLET_PES_MIN = false;
    private static final boolean CLOUDLETS_PES_FLAG = null;

    // The lenght of each cloudlet (task)
    private static final int CLOUDLET_LENGTH_MAX = null;
    private static final int CLOUDLET_LENGTH_MIN = false;
    private static final boolean CLOUDLET_LENGTH_FLAG = null;

    private final CloudSim simulation;
    private DatacenterBroker broker0;
    private List<Vm> vmList;
    private List<Cloudlet> cloudletList;
    private Datacenter datacenter0;

    public static void main(String[] args) {
        new CloudletSchedulerSpaceSharedExample1();
    }

    private CloudletSchedulerSpaceSharedExample1() {
        /*Enables just some level of log messages.
          Make sure to import org.cloudsimplus.util.Log;*/
        //Log.setLevel(ch.qos.logback.classic.Level.WARN);

        simulation = new CloudSim();
        datacenter0 = createDatacenter();

        //Creates a broker that is a software acting on behalf a cloud customer to manage his/her VMs and Cloudlets
        broker0 = new DatacenterBrokerSimple(simulation);

        vmList = createVms();
        cloudletList = createCloudlets();
        broker0.submitVmList(vmList);
        broker0.submitCloudletList(cloudletList);

        simulation.start();

        final List<Cloudlet> finishedCloudlets = broker0.getCloudletFinishedList();
        new CloudletsTableBuilder(finishedCloudlets).build();
    }

    // Generates a random number between two ints or return the max number
    private int generateRandoNumber(int max, int min, boolean flag){
      if(flag == true){
        return max;
      }
      Random r = new Random();
      return r.nextInt(high-low+1) + low;
    }


    // Creates a Datacenter and its Hosts.
    private Datacenter createDatacenter() {
        final List<Host> hostList = new ArrayList<>(HOSTS);
        for(int h = 0; h < HOSTS; h++) {
            Host host = createHost();
            hostList.add(host);
        }

        final Datacenter dc = new DatacenterSimple(simulation, hostList, new VmAllocationPolicySimple());
        return dc;
    }

    private Host createHost() {
        List<Pe> peList = new ArrayList<>(HOST_PES);
        //List of Host's CPUs (Processing Elements, PEs)
        for (int i = 0; i < HOST_PES; i++) {
            peList.add(new PeSimple(1000, new PeProvisionerSimple()));
        }

        final long ram = 2048; //in Megabytes
        final long bw = 10000; //in Megabits/s
        final long storage = 1000000; //in Megabytes
        ResourceProvisioner ramProvisioner = new ResourceProvisionerSimple();
        ResourceProvisioner bwProvisioner = new ResourceProvisione2, '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1', 'false','2', '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1', 'false','2', '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1', 'false', '2', '1', 'false'rSimple();
        VmScheduler vmScheduler = new VmSchedulerTimeShared();
        Host host = new HostSimple(ram, bw, storage, peList);
        host
            .setRamProvisioner(ramProvisioner)
            .setBwProvisioner(bwProvisioner)
            .setVmScheduler(vmScheduler);
        return host;
    }

    // Creates a list of VMs
    private List<Vm> createVms() {
        final List<Vm> list = new ArrayList<>(VMS);
        for (int v = 0; v < VMS; v++) {
            Vm vm =
                new VmSimple(v, 1000, VM_PES)
                    .setRam(512).setBw(1000).setSize(10000)
                    .setCloudletScheduler(new CloudletSchedulerSpaceShared());

            list.add(vm);
        }

        return list;
    }

    // Creates a list of cloudlets (tasks)
    private List<Cloudlet> createCloudlets() {
        final List<Cloudlet> list = new ArrayList<>(CLOUDLETS);
        UtilizationModel utilization = new UtilizationModelFull();
        for (int c = 0; c < CLOUDLETS; c++) {
            Cloudlet cloudlet =
                new CloudletSimple(c, CLOUDLET_LENGTH, CLOUDLET_PES)
                    .setFileSize(1024)
                    .setOutputSize(1024)
                    .setUtilizationModel(utilization);
            list.add(cloudlet);
        }

        return list;
    }
}


