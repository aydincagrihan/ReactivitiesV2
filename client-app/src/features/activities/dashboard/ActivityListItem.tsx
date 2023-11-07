import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { SyntheticEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {format} from 'date-fns'

interface Props {
    activity: Activity
}


export default observer(function ActivityListItem({ activity }: Props) {

    const [target, setTarget] = useState('');
    const { activityStore } = useStore();
    const { deleteActivity, activities, loading: submitting, activitiesByDate } = activityStore


    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}></Item.Header>
                            <Item.Description>Hosted by Çağrıhan</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' />{format(activity.date!,'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="View"></Button>
            </Segment>
        </Segment.Group>
    )
})