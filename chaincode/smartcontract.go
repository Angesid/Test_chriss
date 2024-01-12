package chaincode

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Item struct {
	ID             string `json:"ID"`
	Itemtype       string `json:"type"`
	value          int    `json:"value"`
	Access         string `json:"access"`
	Description    string `json:"description"`
	Cycle          string `json:"cycle"`
	Backup         string `json:"backup"`
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	items := []Item{
		{ID: "TSU1", Itemtype: "Status", Value: 5, Access:"R",Dscription:"",Cycle:"OnDemand",Backup:"yes"},
		{ID: "TSU2", Itemype: "Event", Value: 20,Access: "W",Description: "",Cycle:"OnUpdate",Backup:"no"},
		{ID: "TSU3", Itemtype: "Alert", Value: 35 , Access: "R/W",Description:"",Cycle:"IntervalXXX",Backup:"yes"}
	}

	for _, item := range items {
		itemJSON, err := json.Marshal(item)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(item.ID, ItemJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

func (s *SmartContract) CreateItem(ctx contractapi.TransactionContextInterface, id string, itemtype string, value int, access string, description string, cycle string, backup string) error {
	exists, err := s.ItemExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("%s already exists", id)
	}

	input := input{
		ID:             id,
		Itemtype:       itemtype,
		Value: 			value,
		Access:         access,
		Description:    description,
		Cycle:          cycle,
		Backup:         backup,
	}
	ItemJSON, err := json.Marshal(input)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ItemJSON)
}

func (s *SmartContract) ReadItem(ctx contractapi.TransactionContextInterface, id string) (*input, error) {
	ItemJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if ItemJSON == nil {
		return nil, fmt.Errorf("%s does not exist", id)
	}

	var input input
	err = json.Unmarshal(ItemJSON, &input)
	if err != nil {
		return nil, err
	}

	return &input, nil
}

func (s *SmartContract) UpdateItem(ctx contractapi.TransactionContextInterface, id string, itemtype string, value int, access string, description string, cycle string, backup string) error {
	exists, err := s.ItemExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the input %s does not exist", id)
	}

	input := input{
		ID:             id,
		Itemtype:       itemtype,
		Value: 			value,
		Access:         access,
		Description:    description,
		Cycle:          cycle,
		Backup:         backup,
	}
	ItemJSON, err := json.Marshal(input)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ItemJSON)
}

func (s *SmartContract) DeleteItem(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.ItemExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("%s does not exist", id)
	}

	return ctx.GetStub().DelState(id)
}

func (s *SmartContract) ItemExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	ItemJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return ItemJSON != nil, nil
}


func (s *SmartContract) GetAllItems(ctx contractapi.TransactionContextInterface) ([]*input, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var inputs []*input
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var input input
		err = json.Unmarshal(queryResponse.Value, &input)
		if err != nil {
			return nil, err
		}
		items = append(items, &input)
	}

	return items, nil
}

func (s *SmartContract) checkAuthorization(ctx contractapi.TransactionContextInterface) error {
	creator, err := stub.GetCreator()
	if err != nil {
		return err
	}

	// Perform your access control logic here
	// For example, check if the client's certificate matches an authorized user

	// a set predefined  of authorized users
	authorizedUsers := map[string]bool{
		"AuthorizedUser1": true,
		"AuthorizedUser2": false,
	}

	// Extract the certificate from the client's identity
	cert, err := stub.GetX509Certificate(creator)
	if err != nil {
		return err
	}

	// Check if the certificate's subject common name is in the list of authorized users
	if !authorizedUsers[cert.Subject.CommonName] {
		return fmt.Errorf("User %s is not authorized", cert.Subject.CommonName)
	}

	return nil
}

func main() {
	assetChaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
	  log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
	}
  
	if err := assetChaincode.Start(); err != nil {
	  log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
  }