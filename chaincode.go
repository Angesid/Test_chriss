package main

import (
	"log"
   	"github.com/Angesid/Test_chriss"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	itemChaincode, err := contractapi.NewChaincode(&chaincode.SmartContract{})
	if err != nil {
		log.Panicf("Error creating Parsing chaincode: %v", err)
	}

	if err := itemChaincode.Start(); err != nil {
		log.Panicf("Error starting Parsing chaincode: %v", err)
	}
}