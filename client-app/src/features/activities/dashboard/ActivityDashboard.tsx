import { Button, Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';

export default observer(function ActivityDasboard() {
  const { activityStore } = useStore();
  const { selectedActivity, editMode, setPagingParams, pagination } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const { loadActivities, activityRegistry } = activityStore


  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1))
    loadActivities().then(() => setLoadingNext(false));
  }
  useEffect(() => {
    //<=1 olmasının sebebi örneğin bir activity sayfasında yenileme işlemi yapılıp
    // tekrar geri gelindiğinde o aktiviteyi registryde tutmasıydı diğer aktivitileri registryden siliyordu
    if (activityRegistry.size <= 1) loadActivities();
    // // axios.get<Activity[]>('http://localhost:5000/api/activities').then(response=>{
    // //   console.log(response);
    // //   setActivities(response.data);
    // // })
    // agent.Activities.list().then(response => {
    //   let activities: Activity[] = [];
    //   response.forEach(activity => {
    //     //response gelip datalar basılmadan önce tarih formatında düzenleme yaptım
    //     activity.date = activity.date.split('T')[0];
    //     activities.push(activity);
    //   })
    //   setActivities(response)
    //   setLoading(false)
    // })

  }, [loadActivities])
  if (activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='Loading Activities...' />

  return (
    <Grid>
      <Grid.Column width='10'>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>

      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>

  )
});