import React, { Fragment, useEffect, useState } from 'react';
import {  Container } from 'semantic-ui-react';
import { Activity } from '../models/activity'
import NavBar from './NavBar';
import ActivityDasboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
const {activityStore}=useStore();



  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);


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
// bu 4 function activityStore a taşındığı için burdan siliyorum refactoring yaptım
  // function handleSelectActivity(id: string) {
  //   setSelectedActivity(activities.find(x => x.id === id));
  // }
  // function handleCancelActivity() {
  //   setSelectedActivity(undefined)
  // }

  // function handleFormOpen(id?: string) {
  //   id ? handleSelectActivity(id) : handleCancelActivity();
  //   setEditMode(true);
  // }

  // function handleFormClose() {
  //   setEditMode(false);
  // }
  // function handleCreateOrEditActivity(activity: Activity) {
  //   setSubmitting(true);

  //   if (activity.id) {
  //     agent.Activities.update(activity).then(() => {
  //       setActivities([...activities.filter(x => x.id !== activity.id), activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   }
  //   else {
  //     debugger
  //     activity.id = uuid();
  //     agent.Activities.create(activity).then(() => {
  //       setActivities([...activities, activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   }
  // }

  // function handleDeleteActivity(id: string) {
  //   setSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //   setActivities([...activities.filter(x => x.id !== id)]);
  //     setSubmitting(false);
  //     //
  //   })
  // }
  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App' />
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDasboard/>
      </Container>
    </Fragment>
  );
}

export default observer(App) ;
