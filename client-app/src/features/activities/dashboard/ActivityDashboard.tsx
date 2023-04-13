import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Props{
    activities:Activity[];
    selectedActivity:Activity|undefined;
    selectActivity:(id:string) => void;
    cancelSelectActivity:() => void;


}

export default function ActivityDasboard(props:Props) {

    return (
<Grid>
    <Grid.Column width='10'>
    <ActivityList activities={props.activities} selectActivity={props.selectActivity}  />
    </Grid.Column>
    <Grid.Column width={6}>
        {props.selectedActivity&&
        <ActivityDetails activity={props.selectedActivity} cancelSelectActivity={props.cancelSelectActivity}/>}
        <ActivityForm/>

    </Grid.Column>
</Grid>
        
    )
}