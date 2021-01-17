echo "Creating user folders"
mkdir 'users/'$1''
mkdir 'users/'$1'/algorithms'
mkdir 'users/'$1'/simulations'
mkdir 'public/images/users/'$1''

cp 'public/images/generic_user.png' 'public/images/users/'$1'/photo'