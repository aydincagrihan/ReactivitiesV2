import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function ActivityDasboard() {
    const { activityStore } = useStore();
    const { selectedActivity, editMode } = activityStore;
  useEffect(() => {
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
    activityStore.loadActivities();

  }, [activityStore])
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width={6}>
               <h2>Activity Filters</h2>
               {/* {selectedActivity && !editMode &&
                    <ActivityDetails />}
                {editMode &&
                    <ActivityForm   />} */}
            </Grid.Column>
        </Grid>

    )
});