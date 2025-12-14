This docs endpoint http://10.152.2.9:10680/v1/1/docs will return all docs in the system unfiltered.  It also accepts many query parameters that can be used to filter the data, I'll mention a few below (and you can see some in the prior examples provided):

StartDate=2025-12-11T05:00:00.000Z
Controls the amount of time back in history to search.
If a user were to ask for the last 2 days of data, for instance, it might get set to 2025-12-10T05:00:00.000Z   (our system is set to UTC time)

Destination=maxxmart
Filters based on the destination of the document.
Other values that exist in our test system:
Costco
Lowes
Walmart
Amazon 
Acme 

DocType=810 
Filters based on the document type, often a representation of the X12 EDI transaction type
For instance, if a user asks about an invoice or INV or bill, they might be referring to an X12 EDI 810
Here are a few document types that exist in our test system and what they are
810     (invoice, inv, bill, etc)
850     (order, PO, purchase order)
855     (poa, po ack, purchase order acknowledgement)

Extensions={"INVOICE_NUMBER":"406412_3285897"} 
Filters to only documents which contain a specific invoice number.

TransactionStatus=SENT 
Filters on specific statuses.
Here are a few statuses that exist in our system:
SENT
DEFERRED
ERROR
ACK-MAN
CLEARED



Scenario 1:

The request that one of their users might make would be something like:

        "What is the status of invoice number 22406412_3285897"

The agent would translate that request into a GET operation to the following endpoint  (you can test with basic auth using user: Pramod/password123!):

## API GET Call
http://10.152.2.9:10680/v1/1/docs?selectFiltered=Y&withNotes=true&extensions=%7B%22INVOICE_NUMBER%22:%22406412_3285897%22%7D&sortBy=transactionLastDateTime&sortDir=desc


Which would return a JSON object like this:
## response body
{
    "errors": [],
    "messages": [],
    "successful": true,
    "currentPage": 1,
    "minId": 0,
    "maxId": 0,
    "totalCount": 1,
    "data": [
        {
            "wfid": 3285897,
            "clientId": 1,
            "inboundWfid": 3285892,
            "outboundWfid": 3285898,
            "sourceId": "PRODUXINC",
            "sourceName": null,
            "destinationId": "MAXXMART",
            "destinationName": null,
            "documentType": "810",
            "format": "POS",
            "standard": "TXT",
            "version": "1",
            "testFlag": null,
            "parentWfid": null,
            "reference": "406412",
            "altReference": null,
            "documentDate": null,
            "documentTime": null,
            "documentStatus": "OK",
            "documentStatusReason": "",
            "actionFlag": null,
            "documentCount": 1,
            "originalSize": 3259,
            "finalSize": 183,
            "interchangeNumber": "000000003",
            "groupNumber": "3",
            "transactionNumber": "1",
            "documentValue": null,
            "currencyCode": null,
            "direction": "O",
            "documentCreationDate": 1765505111000,
            "documentLastDateTime": 1765505112000,
            "transactionStatus": "SENT",
            "transactionStatusReason": "",
            "transactionLastDateTime": 1765505112000,
            "docReferences": null,
            "docEvents": null,
            "docExtensions": [],
            "outboundMessage": {
                "clientId": 1,
                "wfid": 3285898,
                "direction": "O",
                "protocol": "FILE",
                "protocolInfo": null,
                "parm1Value": null,
                "parm2Value": "/tmp",
                "reference": "000000003",
                "filename": "PRODUXINC_MAXXMART_810.txt",
                "status": "SENT",
                "statusReason": "",
                "parentWfid": null,
                "actionFlag": null,
                "messageSize": 390,
                "lastDateTime": 1765505112000,
                "protocolParm": null,
                "msgEvents": null,
                "msgExtensions": null,
                "notes": []
            },
            "inboundMessage": {
                "clientId": 1,
                "wfid": 3285892,
                "direction": "I",
                "protocol": "SFTPGET-PORTAL",
                "protocolInfo": null,
                "parm1Value": "test",
                "parm2Value": "/source/file/dir",
                "reference": null,
                "filename": "ProduxInc_OB_INV_810_MaxxMart.txt",
                "status": "RECEIVED",
                "statusReason": "",
                "parentWfid": 3285869,
                "actionFlag": null,
                "messageSize": 3259,
                "lastDateTime": 1765505111000,
                "protocolParm": null,
                "msgEvents": null,
                "msgExtensions": null,
                "notes": []
            },
            "notes": [],
            "ediDocument": null,
            "outboundMessageFilename": "PRODUXINC_MAXXMART_810.txt",
            "inboundMessageFilename": "ProduxInc_OB_INV_810_MaxxMart.txt",
            "outboundMessageStatus": "SENT",
            "outboundMessageStatusReason": "",
            "outboundMessageLastDateTime": 1765505112000,
            "intSenderIdDisp": null,
            "intReceiverIdDisp": null,
            "intControlIdDisp": null,
            "grpSenderIdDisp": null,
            "grpReceiverIdDisp": null,
            "grpFunctionIdDisp": null,
            "grpControlIdDisp": null,
            "trnTypeDisp": null,
            "trnControlIdDisp": null,
            "grpDateTimeDisp": null,
            "overdueDateTimeDisp": null,
            "ackDateTimeDisp": null,
            "statusDisp": null,
            "ackWfidDisp": null,
            "ackIntCtrlIdDisp": null,
            "ackGrpCtrlIdDisp": null,
            "ackTrnCtrlIdDisp": null,
            "ackNumIncDisp": null,
            "ackNumRecDisp": null,
            "ackNumAccDisp": null,
            "overdueOnlyDisp": ""
        }
    ],
    "updatedObject": null,
    "apiVersion": "v2.13.11-9d5f14f"
}