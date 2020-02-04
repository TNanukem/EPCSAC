echo 'Running Python script to generate the cloudsim simulation file'

python3 ../utils/model/model_generator.py "$@"

echo 'Simulation file generated'
