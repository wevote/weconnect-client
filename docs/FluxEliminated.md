### Flux eliminated
* flux has been deprecated and archived for more than 2 years, eventually is will become a problem for WebApp
* flux has been removed from weconnect-client (it still is in some non-used parts, but will be deleted)
* see [React Query Makes Writing React Code 200% Better](https://youtu.be/lVLz_ASqAio?si=7Ji0xWIDoh-DM6VU)

#### Changing to react-query
 
* Stores and actions go away, along with tons of boiler plate code in the pages and components -- maybe half the code in the app goes away, with no loss in functionality.
* All the listeners go away, since cache is managed by react-query, so we don't have to listen for changes.
* The key is that instead of preprocessing data from the API in stores, and writing lots of code to maintain store
  "freshness" react-query automatically maintains fresh data.
* You can pre-process cached data into the AppContext (react app cache not related to react-query).  Store smaller sets of pre-process stored data, 
  but it seems super-fast to just reprocess the data as you need it.

* TeamHome line 41, an API query --
  ```
  const { data, isSuccess, isFetching, isStale } = useFetchData(['team-list-retrieve'], {});
  ```
  useFetchData() is called each time the page is rendered.
  If nothing has invalidated the cache, the result of the query is served from cache -- no API call is made.

* AddPersonDrawerMainContent line 28, a cache invalidation on a mutation
  ```
  const personSaveMutation = useMutation({
    mutationFn: (params) => weConnectQueryFn('person-save', params),
    onSuccess: () => {
      console.log('--------- personSaveMutation  EditPersonForm mutated ---------');
      queryClient.invalidateQueries(['team-list-retrieve']).then(() => {});
    },
  });
  ```
  Mutations only run when called from something like an onClick().  In this case they update a person record,
  which makes the team-list-retrieve in cache stale, so it needs to be invalidated.  The next time a page is 
  loaded that relies on the data from team-list-retrieve the API fires and the cache regains freshness.

