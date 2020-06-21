echo 'Ziping the result files'

cd $1
echo $1
NAME="$2"
echo $NAME

shift 2
echo $@
zip $NAME.zip "$@"
