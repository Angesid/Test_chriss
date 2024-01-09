package main

import (
	"log"
    //change repository
	"github.com/Angesid/Test_chriss"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	itemChaincode, err := contractapi.NewChaincode(&chaincode.SmartContract{})
	if err != nil {
		log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
	}

	if err := itemChaincode.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}