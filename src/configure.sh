mkdir users
npm install
git clone https://github.com/manoelcampos/cloudsim-plus

createdb -h localhost -p 5432 -U postgres EPCSAC
psql -h localhost -p 5432 -U postgres -d EPCSAC -a -f "EPCSAC_DATABASE.sql"