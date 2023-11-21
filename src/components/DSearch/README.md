# DSearch

This directory is the source code for the DC DMV Customer Service Representative(CSR) applicaiton's search system. The following documentation will explain first how the system is structured and opperates and then how to maintain and exapand upon the search system's capabilities.

## SEARCH LAYOUT

The DSearch component is a really a series of 4 screens:

1. **Search Form** - The search form is the set of input fields that the csr searches upon. There are multiple search 'types', each having their own 'form'. Currently there are 7 search types: Transactions, Individual, Business, Vehicle, Employee, Check and Email. These are available from the blue search menu on the left of the interface. Each 'type' has it's own unique form to search with. The code representing these forms is avaialble in the 'fragments' folder (destiny-ui/destiny/src/components/DSearch/pages/fragments).
2. **Sarch Results** - All search results are parsed by the SearchResults page. The search api returns a json payload. This payload provides a schema section and a results section. The schema informs the SearchResults.jsx how to structure the results table - table headers, sortability, etc... The results section is then looped over to hydrate that table. If no results are returned for a search the user recieves a empty search results messages along with the appropriate call to action.
3. **Search History** - This page is a history of previous searches by the current user (CSR). Selecting any of these previous searches re-runs that search.
4. **Search Error** - Hopefully this page is never used :) This pages is triggered if an error is returned by the search results payload.

## HOW DOES IT WORK?

There is one search component for all search types - DSearch. Upon loading the DSearch has a 'type' set for which search type it is. This type triggers which search form to display to the user and which search to trigger in the API when the form is submitted.

The API provides the Search Results page with both the schema and the associated results for the search telling the page how to structure and display the results.

The Search History is populated by passing the current user (csr) to the API and it returning a list of all previous searches performed by the csr.

## ADDING A NEW SEARCH FORM

In order to add a new search form or type to the DSearch component a developer should:

1. Copy the SearchFormTemplate folder found @destiny-ui/templates/SearchFormTemplate (copy the whole folder).
2. Paste this folder into the DSearch fragments folder located @destiny-ui/destiny/src/components/DSearch/pages/fragments
3. Rename both the folder and the main function in index.jsx file to represent the new search form that you are developing (IE - Cheack, Email, Personal Details, etc...).
4. Build your form!
5. Create a schema and results template .json file in the assets folder (destiny-ui/destiny/src/components/DSearch/assets).
6. Import the new .json to the SearchResults.jsx file (destiny-ui/destiny/src/components/DSearch/pages/SearchResults.jsx)<br>![Alt text](../../../../docs/search-import-json.png?raw=true 'repo root folder structure')
7. Add the new data object to the results switch statement. (This will all go away when connected to an API).<br>![Alt text](../../../../docs/search-result-case.png?raw=true 'repo root folder structure')

## TODO - STUFF THAT STILL HAS TO BE DONE!?!?!?!?

Much of the search funcitonality is waiting on the API to be completed. Obviously - the search functionality has a high dependency on the API.

There are a handful of tasks to complete for search to reach full functionality:

1. Search 'Type' enablement depending upon WHERE the search is being instantiated. For instance - if accessing the search from 'employee maintenance' a sub-set of the search types will be avaialble. Similarly, if accessing from the Dashboard, a different set will be avaialble. A prop needs to be setup telling us which sub-set should be available in the search menu:<br> ![Alt text](../../../../docs/search-menu.png?raw=true 'repo root folder structure')<br> A developer's first thought is probably to just pass in a list of menu types that should be turned on in the prop. My suggestion is to instead set up 'type' sets - arrays that are a list of search lists. For instance:<br>`const employeeType = [Employee, Email];`<br>`const dashboardType=[Transactions, Individual, Business, Vehicle, Check];`<br>The prop would just be telling you which array to loop over to display types in the menu when initializing the search.
2. Currently, each of the search results types is a separate json file representing the schema and results for that 'type' of search. This will have to be communicated and negotiated with Vigil and the API team. Any updates to how the schema or results are provided will require corresponding changes in the code base.
3. Adding extra touches like 'add new employee' button or 'filter' capabilities for some search results. The developer's first thought will probably be to create a new - special - search results page to add these new capablities on top of generic search results. THIS SHOULD BE AVOIDED. Instead - the developer should key off of the prop telling which 'type' of search this is and add those new items, conditionally, to SerachResults.jsx to avoid duplicating functionality.
