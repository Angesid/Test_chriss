/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

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
                TIMESTAMP:"25",
            },
            {
              ID: "6.71234567890123E+28",
              TSUTEMPERATURESTAT: "-10",
              PTPDEVICETYPE: "160",
              PTPDEVICEPORTSTAT: "80",
              PTPCLOCKCLASS: "120",
              PTPCLOCKACCURACY: "80",
              TSUMANAGEPLUGSTATUS: "90",
              PTPPROFILEINUSE: "5",
              TSUSFPSTATUS: "1",
              EXTERNALSLOTSTATUS: "0",
              DCPOWERSWITCH: "85",
              IMUSHOCKDETECT: "140",
              TSUENCLOSURESTAT: "35",
              TSUOVERHEATSTAT: "75",
              TSUINTERNALERROR: "54318",
              GNSSAUTHENTICATIONVIOLATION: "",
              GNSSINTERFERENCEPRESENCE: "10",
              TSUHOLDOVEREVENT: "55",
              TIMESTAMP:"20",
            },
            {
              ID: "7.81234567890123E+28",
              TSUTEMPERATURESTAT: "-15",
              PTPDEVICETYPE: "180",
              PTPDEVICEPORTSTAT: "90",
              PTPCLOCKCLASS: "130",
              PTPCLOCKACCURACY: "85",
              TSUMANAGEPLUGSTATUS: "95",
              PTPPROFILEINUSE: "10",
              TSUSFPSTATUS: "2",
              EXTERNALSLOTSTATUS: "1",
              DCPOWERSWITCH: "90",
              IMUSHOCKDETECT: "160",
              TSUENCLOSURESTAT: "40",
              TSUOVERHEATSTAT: "80",
              TSUINTERNALERROR: "54319",
              GNSSAUTHENTICATIONVIOLATION: "",
              GNSSINTERFERENCEPRESENCE: "20",
              TSUHOLDOVEREVENT: "60",
              TIMESTAMP:"15",
            },
            {
              ID: "8.91234567890123E+28",
              TSUTEMPERATURESTAT: "-20",
              PTPDEVICETYPE: "200",
              PTPDEVICEPORTSTAT: "100",
              PTPCLOCKCLASS: "140",
              PTPCLOCKACCURACY: "90",
              TSUMANAGEPLUGSTATUS: "100",
              PTPPROFILEINUSE: "20",
              TSUSFPSTATUS: "5",
              EXTERNALSLOTSTATUS: "2",
              DCPOWERSWITCH: "95",
              IMUSHOCKDETECT: "180",
              TSUENCLOSURESTAT: "45",
              TSUOVERHEATSTAT: "85",
              TSUINTERNALERROR: "54320",
              GNSSAUTHENTICATIONVIOLATION: "",
              GNSSINTERFERENCEPRESENCE: "30",
              TSUHOLDOVEREVENT: "65",
              TIMESTAMP:"10",
            },
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
                TIMESTAMP:"25",
            },
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
                TIMESTAMP:"25",
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    async InitGlossaryLedger(ctx) {
        const glossarys = [
            {
                UI:"DeviceID",
                ParameterType:"status",
                Description:" Unique device identifier ",
                Unit:"",
                DataType:"long long int[2]",
                Range:"0:(296-1)",
                LSB:"1",
                Cycle:"OnDemand",
                Access:"R",
                Default:"Unique ID of processor",
                Backup:"No",
             },
             {
              UI:"TSUtemperatureStat",
              ParameterType:"status",
              Description:"Temperature of TSU device ",
              Unit:"°C",
              DataType:"signed char",
              Range:"-127…+128",
              LSB:"1",
              Cycle:"OnDemand, Interval1min",
              Access:"R",
              Default:"",
              Backup:"No",
             },
             {
               UI:"PTPdevicePortStat",
               ParameterType:"status",
               Description:"Status of each SFP port in TSU ",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"TPTPclockClass",
               ParameterType:"status",
               Description:"PTP clock class denotes the traceability, synchronization state and expected performance of the time or frequency distributed by the Grandmaster PTP Instance ",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"248",
               Backup:"No",
              },
              {
               UI:"PTPclockAccuracy",
               ParameterType:"status",
               Description:"PTP clock class denotes the traceability, synchronization state and expected performance of the time or frequency distributed by the Grandmaster PTP Instance ",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"248",
               Backup:"No",
              },
              {
               UI:"TPTPclockClass",
               ParameterType:"status",
               Description:"PTP clock accuracy used in BMCA algorithm.  ",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"248",
               Backup:"No",
              },
              {
               UI:"TSUmanagePlugStatus",
               ParameterType:"status",
               Description:"Status of management interface ",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"248",
               Backup:"No",
              },
              {
               UI:"PTPprofileInUse",
               ParameterType:"status",
               Description:"PTP profile used by TSU",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"TSUsfpStatus",
               ParameterType:"event",
               Description:"Define SFP plug/unplug event",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"ExternalSlotStatus",
               ParameterType:"event",
               Description:"Extension slot status.",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"DCpowerSwitch",
               ParameterType:"event",
               Description:"AC/DC power modules info. Each TSU has two AC/DC power supply.",
               Unit:"V - for 5 bit LSB",
               DataType:"",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"IMUshockDetect",
               ParameterType:"alert",
               Description:"Shock detected (by Inertial Motion Unit IC) status",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"TSUenclosureStat",
               ParameterType:"alert",
               Description:"TSU enclosure open detect.",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"EEPROM memory",
              },
              {
               UI:"TSUoverheatStat",
               ParameterType:"alert",
               Description:"TSU overheat detected.",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"1",
               Cycle:"OnDemand/OnUpdate",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"TSUinternalError",
               ParameterType:"alert",
               Description:"TSU internal software and hardware module status.",
               Unit:"",
               DataType:"unsigned short",
               Range:"0…+65535",
               LSB:"1",
               Cycle:"OnDemand",
               Access:"R",
               Default:"0",
               Backup:"No",
              },
              {
               UI:"GNSSauthenticationViolation",
               ParameterType:"alert",
               Description:"Detected alert of the GNSS OSMNA signal authentication fail or error.",
               Unit:"- ; number XX of the satellite, Vehicle identification (SVxx)",
               DataType:"unsigned int",
               Range:"",
               LSB:"",
               Cycle:"When changed / On demand",
               Access:"",
               Default:"",
               Backup:"",
              },
              {
              UI:"GNSSinterferencePresence",
              ParameterType:"alert",
              Description:"GNSS receiver will emit an information flag regarding the interference presence. ",
              Unit:"",
              DataType:"unsigned char",
              Range:"0…+255",
              LSB:"",
              Cycle:"When changed / On demand",
              Access:"",
              Default:"",
              Backup:"",
             },
             {
               UI:"TSUholdoverEvent",
               ParameterType:"event",
               Description:"TSU information about switching the source of time.",
               Unit:"",
               DataType:"unsigned char",
               Range:"0…+255",
               LSB:"",
               Cycle:"When changed / On demand",
               Access:"",
               Default:"",
               Backup:"",
              },
             {
              UI:"PTPdeviceType",
              ParameterType:"status",
              Description:"Define type of PTP device in network",
              Unit:"unsigned char",
              DataType:"",
              Range:"0…+255",
              LSB:"1",
              Cycle:"OnDemand/OnUpdate",
              Access:"R",
              Default:"0",
              Backup:"No",
             },
        ];

        for (const glossary of glossarys) {
            glossary.docType = 'glossary';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(glossary.UI, Buffer.from(stringify(sortKeysRecursive(glossary))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
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
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

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
            TIMESTAMP: time,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }


    async ReportAlert(ctx, 
        id,
        param,
        value,
        timestamp) {
        const exists = await this.AlertExists(ctx, id);
        if (exists) {
            throw new Error(`The alert ${id} already exists`);
        }

        const alert = {
            ID: id,
            Parameter: param,
            Value: value,
            Timestamp: timestamp,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(alert))));
        return JSON.stringify(alert);
    }



    async ReadAlert(ctx, id) {
        const alertJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!alertJSON || alertJSON.length === 0) {
            throw new Error(`The alert ${id} does not exist`);
        }
        return alertJSON.toString();
    }

 async ReadGlossary(ctx, id) {
        const glossaryJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!glossaryJSON || glossaryJSON.length === 0) {
            throw new Error(`The parameter with name ${id} does not exist`);
        }
        return glossaryJSON.toString();
    }

       // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async AlertExists(ctx, id) {
        const alertJSON = await ctx.stub.getState(id);
        return alertJSON && alertJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
