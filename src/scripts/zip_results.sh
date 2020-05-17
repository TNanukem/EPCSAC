echo 'Ziping the result files'
NAME="$1"
shift
zip $NAME.zip "$@"
