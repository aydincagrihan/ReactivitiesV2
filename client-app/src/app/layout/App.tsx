import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Header, List } from 'semantic-ui-react';
import {Activity} from '../models/activity'
import NavBar from './NavBar';
import ActivityDasboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
const [activities,setActivities]=useState<Activity[]>([]);

useEffect(()=>{
axios.get<Activity[]>('http://localhost:5000/api/activities').then(response=>{
  console.log(response);
  setActivities(response.data);
})
},[])
  return (
    <Fragment>
    <NavBar/>
    <Container style={{marginTop:'7em'}}>
      <ActivityDasboard activities={activities}/>
    </Container>
    </Fragment>
  );
}

export default App;
