/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    // Initialize Ledger and avoid duplicates
    async InitLedger(ctx) {
        const assets = [
            {
                ID: "9.01234567890123E+28",
                TSUTEMPERATURESTAT: "-18",
                PTPDEVICETYPE: "224",
                PTPDEVICEPORTSTAT: "110",
                PTPCLOCKCLASS: "150",
                PTPCLOCKACCURACY: "95",
                TSUMANAGEPLUGSTATUS: "105",
                PTPPROFILEINUSE: "30",
                TSUSFPSTATUS: "10",
                EXTERNALSLOTSTATUS: "3",
                DCPOWERSWITCH: "99",
                IMUSHOCKDETECT: "200",
                TSUENCLOSURESTAT: "50",
                TSUOVERHEATSTAT: "90",
                TSUINTERNALERROR: "54321",
                GNSSAUTHENTICATIONVIOLATION: "",
                GNSSINTERFERENCEPRESENCE: "40",
                TSUHOLDOVEREVENT: "70",
                TIMESTAMP: "25",
            },
            // Additional assets as per your original data...
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            const exists = await this.AssetExists(ctx, asset.ID); // Check if asset already exists
            if (!exists) {
                await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive([asset])))); // Store as array
            } else {
                console.log(`Asset with ID ${asset.ID} already exists. Skipping.`);
            }
        }
    }

    // Validate asset fields to prevent invalid data
    validateAssetFields(asset) {
        if (!asset.ID || asset.ID.trim() === '') {
            throw new Error('Asset ID is required and cannot be empty');
        }
        if (!asset.TSUTEMPERATURESTAT || isNaN(asset.TSUTEMPERATURESTAT)) {
            throw new Error('TSUTEMPERATURESTAT must be a valid number');
        }
        if (!asset.PTPDEVICETYPE || isNaN(asset.PTPDEVICETYPE)) {
            throw new Error('PTPDEVICETYPE must be a valid number');
        }
        // Add similar validation checks for other fields as needed
    }

    // CreateAsset with additional validation checks
    async CreateAsset(ctx,
        id,
        temp,
        ptptype,
        portstat,
        ptpclock,
        accur,
        manage,
        profile,
        sfpstatus,
        slotstatus,
        power,
        shock,
        closure,
        overheat,
        error,
        authentication,
        interference,
        holdover,
        time) {
    
        // Ensure timestamp is a string (in case it's passed as a number)
        const timestampStr = time.toString(); 
    
        // Create a composite key using ID and Timestamp
        const compositeKey = ctx.stub.createCompositeKey('asset', [id, timestampStr]);
    
        const asset = {
            ID: id,
            TSUTEMPERATURESTAT: temp,
            PTPDEVICETYPE: ptptype,
            PTPDEVICEPORTSTAT: portstat,
            PTPCLOCKCLASS: ptpclock,
            PTPCLOCKACCURACY: accur,
            TSUMANAGEPLUGSTATUS: manage,
            PTPPROFILEINUSE: profile,
            TSUSFPSTATUS: sfpstatus,
            EXTERNALSLOTSTATUS: slotstatus,
            DCPOWERSWITCH: power,
            IMUSHOCKDETECT: shock,
            TSUENCLOSURESTAT: closure,
            TSUOVERHEATSTAT: overheat,
            TSUINTERNALERROR: error,
            GNSSAUTHENTICATIONVIOLATION: authentication,
            GNSSINTERFERENCEPRESENCE: interference,
            TSUHOLDOVEREVENT: holdover,
            TIMESTAMP: timestampStr,
        };
    
        // Save asset to the blockchain with the composite key
        await ctx.stub.putState(compositeKey, Buffer.from(stringify(sortKeysRecursive(asset))));
    
        return JSON.stringify(asset);
    }
    
    // ReportAlert with enhancement to store multiple alerts for one ID
    async ReportAlert(ctx, id, param, value, timestamp) {
        const timestampStr = timestamp.toString(); // Ensure timestamp is a string
    
        // Create a unique composite key using ID + TIMESTAMP
        const compositeKey = ctx.stub.createCompositeKey('alert', [id, timestampStr]);
    
        const newAlert = {
            ID: id,
            Parameter: param,
            Value: value,
            Timestamp: timestampStr,
        };
    
        // Store alert using composite key
        await ctx.stub.putState(compositeKey, Buffer.from(stringify(sortKeysRecursive(newAlert))));
    
        return JSON.stringify(newAlert);
    }

    // ReadAsset returns the array of assets stored in the world state with the given ID.
    async ReadAsset(ctx, id) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByPartialCompositeKey('asset', [id]); 
    
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }
    
        if (allResults.length === 0) {
            throw new Error(`No records found for device ID: ${id}`);
        }
    
        return JSON.stringify(allResults);
    }

    async ReadAlert(ctx, id) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByPartialCompositeKey('alert', [id]);
    
        while (true) {
            const res = await iterator.next();
    
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(record);
            }
    
            if (res.done) {
                await iterator.close();
                break;
            }
        }
    
        if (allResults.length === 0) {
            throw new Error(`No alerts found for device ID: ${id}`);
        }
    
        return JSON.stringify(allResults);
    }
    

    // Validate asset existence
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // Validate alert existence
    async AlertExists(ctx, id) {
        const alertJSON = await ctx.stub.getState(id);
        return alertJSON && alertJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', ''); // Get all records
    
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                try {
                    const record = JSON.parse(res.value.value.toString('utf8'));
                    allResults.push({
                        key: res.value.key,  // Include the key to help debug
                        record: record
                    });
                } catch (err) {
                    console.log('Error parsing record:', err);
                    allResults.push({
                        key: res.value.key,
                        record: res.value.value.toString('utf8')
                    });
                }
            }
    
            if (res.done) {
                await iterator.close();
                break;
            }
        }
    
        return JSON.stringify(allResults);
    }
    
}

module.exports = AssetTransfer;