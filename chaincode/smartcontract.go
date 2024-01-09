package chaincode

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Item struct {
	ID    string `json:"ID"`
	Owner string `json:"Owner"`
	Value string `json:"Value"`
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	items := []Item{
		{ID: "Item1", Owner: "Alice",Value:"A Yellow Lamp"},
		{ID: "Item2", Owner: "Bob",Value:"A Green Parrot"},
		{ID: "Item3", Owner: "Charlie",Value:"A Carrot Cake"}
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

func (s *SmartContract) CreateItem(ctx contractapi.TransactionContextInterface, id string, owner string,value string) error {
	exists, err := s.ItemExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("%s already exists", id)
	}

	Item := Item{
		ID:             id,
		Owner:          owner,
		Value: 			value,
	}
	ItemJSON, err := json.Marshal(Item)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ItemJSON)
}

func (s *SmartContract) ReadItem(ctx contractapi.TransactionContextInterface, id string) (*Item, error) {
	ItemJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if ItemJSON == nil {
		return nil, fmt.Errorf("%s does not exist", id)
	}

	var Item Item
	err = json.Unmarshal(ItemJSON, &Item)
	if err != nil {
		return nil, err
	}

	return &Item, nil
}

func (s *SmartContract) UpdateItem(ctx contractapi.TransactionContextInterface, id string, owner string, value string) error {
	exists, err := s.ItemExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the Item %s does not exist", id)
	}

	Item := Item{
		ID:             id,
		Owner:          owner,
		Value: 			value,
	}
	ItemJSON, err := json.Marshal(Item)
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

func (s *SmartContract) TransferItem(ctx contractapi.TransactionContextInterface, id string, newOwner string) (string, error) {
	Item, err := s.ReadItem(ctx, id)
	if err != nil {
		return "", err
	}

	oldOwner := Item.Owner
	Item.Owner = newOwner

	ItemJSON, err := json.Marshal(Item)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState(id, ItemJSON)
	if err != nil {
		return "", err
	}

	return oldOwner, nil
}

func (s *SmartContract) GetAllItems(ctx contractapi.TransactionContextInterface) ([]*Item, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var items []*Item
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var Item Item
		err = json.Unmarshal(queryResponse.Value, &Item)
		if err != nil {
			return nil, err
		}
		items = append(items, &Item)
	}

	return items, nil
}
