export PATH=${PWD}/../fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../fabric-samples/config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../fabric-samples/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export core_peer_mspconfigpath=${PWD}/../fabric-samples/organizations/peerorganizations/org1.example.com/users/admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051