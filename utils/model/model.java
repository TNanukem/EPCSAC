/*
 * CloudSim Plus: A modern, highly-extensible and easier-to-use Framework for
 * Modeling and Simulation of Cloud Computing Infrastructures and Services.
 * http://cloudsimplus.org
 *
 *     Copyright (C) 2015-2018 Universidade da Beira Interior (UBI, Portugal) and
 *     the Instituto Federal de Educação Ciência e Tecnologia do Tocantins (IFTO, Brazil).
 *
 *     This file is part of CloudSim Plus.
 *
 *     CloudSim Plus is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     CloudSim Plus is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with CloudSim Plus. If not, see <http://www.gnu.org/licenses/>.
 */


 /* Model archive to the ---- */
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
    private static final int DATACENTER_MAX = 2;
    private static final int DATACENTER_MIN = 1;
    private static final boolean DATACENTER_FLAG = false;

    // Number of hosts inside a datacenter
    private static final int HOSTS_MAX = 2;
    private static final int HOSTS_MIN = 1;
    private static final boolean HOSTS_FLAG = false;

    // Number of processing units inside each host
    private static final int HOST_PES_MAX = 4;
    private static final int HOST_PES_MIN = 3;
    private static final boolean HOSTS_PES_FLAG = false;

    // RAM of each Host
    private static final int HOST_RAM_MAX = 4;
    private static final int HOST_RAM_MIN = 3;
    private static final boolean HOSTS_RAM_FLAG = false;

    // BW of each Host
    private static final int HOST_BW_MAX = 4;
    private static final int HOST_BW_MIN = 3;
    private static final boolean HOSTS_BW_FLAG = false;

    // HD of each host
    private static final int HOST_HD_MAX = 4;
    private static final int HOST_HD_MIN = 3;
    private static final boolean HOSTS_HD_FLAG = false;

    // Number of VMs inside the datacenter
    private static final int VMS_MAX = 2;
    private static final int VMS_MIN = 1;
    private static final boolean VMS_FLAG = false;

    // Number of processing units inside each VM
    private static final int VM_PES_MAX = 4;
    private static final int VM_PES_MIN = 3;
    private static final boolean VMS_PES_FLAG = false;

    // RAM of each VM
    private static final int VM_RAM_MAX = 4;
    private static final int VM_RAM_MIN = 3;
    private static final boolean VMS_RAM_FLAG = false;

    // BW of each VM
    private static final int VM_BW_MAX = 4;
    private static final int VM_BW_MIN = 3;
    private static final boolean VMS_BW_FLAG = false;

    // HD of each VM
    private static final int VM_HD_MAX = 4;
    private static final int VM_HD_MIN = 3;
    private static final boolean VMS_HD_FLAG = false;

    // Number of cloudlets (tasks)
    private static final int CLOUDLETS_MAX = 4;
    private static final int CLOUDLETS_MIN = 3;
    private static final boolean CLOUDLETS_FLAG = false;

    // Number of processing units necessary to run each cloudlet (task)
    private static final int CLOUDLET_PES_MAX = 2;
    private static final int CLOUDLET_PES_MIN = 1;
    private static final boolean CLOUDLETS_PES_FLAG = false;

    // The lenght of each cloudlet (task)
    private static final int CLOUDLET_LENGTH_MAX = 10001;
    private static final int CLOUDLET_LENGTH_MIN = 10000;
    private static final boolean CLOUDLET_LENGTH_FLAG = false;

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
        ResourceProvisioner bwProvisioner = new ResourceProvisionerSimple();
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
