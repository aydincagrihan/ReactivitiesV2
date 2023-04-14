import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import {Activity} from '../models/activity'
import NavBar from './NavBar';
import ActivityDasboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
const [activities,setActivities]=useState<Activity[]>([]);
const[selectedActivity,setSelectedActivity] = useState<Activity|undefined>(undefined);
const[editMode,setEditMode] = useState(false);
const[loading,setLoading] = useState(true);

useEffect(()=>{
// axios.get<Activity[]>('http://localhost:5000/api/activities').then(response=>{
//   console.log(response);
//   setActivities(response.data);
// })
agent.Activities.list().then(response=>{
  let activities:Activity[]=[];
 response.forEach(activity=>{
  //response gelip datalar basılmadan önce tarih formatında düzenleme yaptım
activity.date=activity.date.split('T')[0];
activities.push(activity);
 })
  setActivities(response)
  setLoading(false)
})

},[])

function handleSelectActivity(id:string){
  setSelectedActivity(activities.find(x=>x.id===id));
}
function handleCancelActivity(){
  setSelectedActivity(undefined)
}

function handleFormOpen(id?:string){
  id? handleSelectActivity(id):handleCancelActivity();
  setEditMode(true);
}

function handleFormClose(){
setEditMode(false);
}
function handleCreateOrEditActivity(activity:Activity){
  activity.id ? setActivities([...activities.filter(x=>x.id!==activity.id),activity])
  :
  setActivities([...activities,{...activity,id:uuid()}]);
  setEditMode(false);
  setSelectedActivity(activity);
}

function handleDeleteActivity(id:string){
  setActivities([...activities.filter(x=>x.id!==id)]);
}
if(loading) return <LoadingComponent content='Loading App'/>


  return (
    <Fragment>
    <NavBar openForm={handleFormOpen}  />
    <Container style={{marginTop:'7em'}}>
      <ActivityDasboard
       activities={activities}
       selectedActivity={selectedActivity}
       selectActivity={handleSelectActivity}
       cancelSelectActivity={handleCancelActivity}
       editMode={editMode}
      openForm={handleFormOpen}
      closeForm={handleFormClose}
      createOrEdit={handleCreateOrEditActivity}
      deleteActivity={handleDeleteActivity}
       />
    </Container>
    </Fragment>
  );
}

export default App;
