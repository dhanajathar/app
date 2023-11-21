# DTransaction

This directory is the source code for the DC DMV Customer Service Representative(CSR) applicaiton's transaction system which represents the bulk of the CSR application's functionality. The following documentation will explain first how the system is structured and opperates and then how to maintain and exapand upon the transaction system's capabilities.

## TRANSACTION LAYOUT

The DTransaction component is an orchestrator which effectively divides the screen into 4 distinct zones of functionality:

1. **Breadcrumb** - RED
2. **Forms** - BLUE
3. **Footer Nav** - GREEN
4. **Progress Stepper** - ORANGE

![Alt text](../../../../docs/transaction-zones.png?raw=true 'repo root folder structure')

This is laid out in the index.jsx (destiny-ui/destiny/conponents/DTransaction/index.jsx) of DTransaction (the highlight color coding corresponds to the color coding of the above screenshot):

![Alt text](../../../../docs/transaction-layout-code.png?raw=true 'repo root folder structure')

This provides a responsive layout within the responsive layout of the shell.
**THERE BE DRAGONS**
![Alt text](../../../../docs/dragon.png?raw=true 'repo root folder structure')
**THE CLASSES AND LAYOUT SHOULD NOT BE ADJUSTED WITHOUT CONSIDERATION AND CONVERSATION.**
**Any changes to this layout will have repurcussions to all transaction views, not just the current one that you are viewing!**

## HOW DOES IT WORK?

These four separate components consume a .json payloade (which will be) provided by the api representing the 'flow' of the super transaction and its associated transactions based off of <a href="../../../../docs/Master_Tran_ID_List.xlsx" download>Master Trans Type IDs</a>.

The display of these flows are synchronized through use of the event service (destiny-ui/destiny/services/DEventService.js) utilizing the PROGRESS and BREADCRUMB events. These events are triggered as each Form is loaded, updating the other components in the view (DBreadcrumb, DTransactionNav and DProgressStepper), which have event listeners provided by the same event service.

![Alt text](../../../../docs/transaction_event_setup.png?raw=true 'repo root folder structure')

**ALL NEW FORMS MUST HAVE THIS EVENT DISPATCHER PLACED AT THE BEGINNING OF THE FORM IN ORDER TO UPDATE THE OTHER COMPONENTS.**
Let'a take a closer look at this event:  
![Alt text](../../../../docs/transaction_dispatch_event.png?raw=true 'repo root folder structure')
The first thing that you will notice is that our dispatch resides within a **setTimeout()** - this delays the dispatch 100 milliseconds upon load. This is important and in place to avoid a race condition that can exist on with the first form that loads in a transaction flow.

The next line **DEventService.dispatch()** emits the PROGRESS event which the orchestrator in DTransaction (destiny-ui/destiny/src/components/DTransaction.index.jsx) is listening for events from. The orchestrator will then parse the payload held in the detail section:  
![Alt text](../../../../docs/transaction-events-details.png?raw=true 'repo root folder structure')\  
The detail section holds values for:

1. **label** - which is the label that you would like to appear in the progress stepper and breadcrumb.
2. **step** - usually a duplicate of the label but a second parse because sometimes more detail may be needed.
3. **flowId** - a unique identifier for this specific step in the flow - pulled in from the api response and set by grabbing the param from the url bar - see line previous to the setTimeout():\  
   ![Alt text](../../../../docs/transaction_flowid.png?raw=true 'repo root folder structure')
4. **substep** - this tells us whether this step is a child or a parent in the progress-stepper. **THIS WILL PROBABLY NEED TO BE MADE DYNAMIC EVENTUALLY - MUCH LIKE THE flowId ABOVE - SEE TODO SECTION AT END**

Each Form is imported from its location in the pages folder (destiny-ui/destiny/scr/components/DTransaction/pages/) and represented as a Route in the index.jsx (destiny-ui/destiny/src/index.jsx).

![Alt text](../../../../docs/transaction-import-routes.png?raw=true 'repo root folder structure')

These Forms which are required to complete the transactions all live in the pages folder (destiny-ui/destiny/src/components/DTransaction/pages):

![Alt text](../../../../docs/transaction-pages-folder.png?raw=true 'repo root folder structure')

All of this is fed from the json payload which will be provided by the api. This is mocked in the transactionData.json (destiny-ui/destiny/src/components/DTransaction/data/transactionData.json).

The payload is divided into 2 distinct sections:

1. **Super Transaction** (red) - This section represents the Super Transaction and it's associated transactions.
2. **Flow** (blue) - This section represents the ordering and distinct steps required to complete the associated Super Transaction. It defines which forms (Address, Fees, Scan, etc.) need to be completed and and in what order.

![Alt text](../../../../docs/transaction-json.png?raw=true 'repo root folder structure')

Let's take a closer look at these two sections!

**Super Transaction Section**
This section provides all of the details about a Super Transaction and it's children Transactions that are needed to allow us to complete each of the Transactions.

![Alt text](../../../../docs/transaction-super-json.png?raw=true 'repo root folder structure')

The super transaction section is really two parts. The super transaction id and an array of transaction objects representing the key data points for those transactions. This data is utilized to populate the 'blue I' icon dropdowns in the breadcrumb. Each of those data points can be mapped to the items displayed in the dropdown.

**Flow Section**
This section is what is fed to the transaction orchestrator and generates the transaction flows in the csr applicaton.

![Alt text](../../../../docs/transaction-flow-json.png?raw=true 'repo root folder structure')

Key points to recognize in this schema would be that a 'flow' is made up of an array of objects representing the steps to be taken to complete a super transaction (a set of transactions sometimes just one).

Each 'node' in follows the same schema:

1. **label** - The title to be displayed in Breadcrumb and highlightdd in Progress Stepper when path is loaded
2. **status** - Denotes whether this step has been completed
3. **path** - the route url for this step along with it's flowId
4. **flowId** - represents the specific step that this page is associated to - needed because some pages can appear several times in a flow (scan documents for instance).
5. **subSteps** - Optional array of child nodes - substeps appear indented in the Progress Stepper

## ADDING A NEW TRANSACTION

In order to add a new transaction form or step to the DTransaction component a developer should:

1. Copy the TransactionFormTemplate folder found @destiny-ui/templates/TransactionFormTemplate (copy the whole folder).
2. Paste this folder into the DTransaction pages folder located @destiny-ui/destiny/src/components/DTransaction/pages/
3. Rename both the folder and the main function in index.jsx file to represent the new form that you are developing (IE - Address, Payment, BoardOfElections, etc...).
4. Build your form!
5. Import AND add the form to the Routes in index.jsx (destiny-ui/destiny/src/components/DTransaction/index.jsx)

![Alt text](../../../../docs/transaction-import-add.png?raw=true 'repo root folder structure')

**Make sure to update the path appropriately as well**

## TODO - STUFF THAT STILL HAS TO BE DONE!?!?!?!?

The currentTransaction variable is currently hard-coded to 0, which works fine when first coming to a transaction from the transaction selection tool but won't work when returning to an already started transaction. Instead, we should decide what the currentPage is from the API return.<br>
![Alt text](../../../../docs/todo-transaction-current.png?raw=true 'repo root folder structure')

This will also allow us to pof pull the PROGRESS events out of the pages and into the index.jsx by allowing us to pull all of the information required for the progress event payload.
