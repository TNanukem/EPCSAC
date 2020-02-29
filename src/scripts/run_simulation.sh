echo 'Starting simulation script'
cd cloudsim-plus/
echo 'Starting the model simulation'
/bin/bash script/bootstrap.sh build
echo 'Build of maven done'
/bin/bash script/bootstrap.sh org.cloudsimplus.examples.schedulers.Model
echo 'Model done'
