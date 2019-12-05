mkdir ProjectName

cd ProjectName

truffle init - init new project

mkdir loom

cd loom

curl https://raw.githubusercontent.com/loomnetwork/loom-sdk-documentation/master/scripts/get_loom.sh | sh - download last loom package

cd ..

./loom/loom genkey -a loom_public_key -k loom_private_key - generate new keys

create smart contract

create migration file

create package.json

npm i

npm i loom-truffle-provider

config truffle-config.js

cd loom

./loom init

./loom run - for running local loom test net

cd ..

truffle migrate --network loom_dapp_chain - migration files and deploynig
truffle deploy --reset --network loom_dapp_chain - reset contract

create test file for testing smart contract

truffle test -—network development - test contract

truffle migrate --network extdev - deploy to the loom test network
