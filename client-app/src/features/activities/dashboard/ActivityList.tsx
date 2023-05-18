import { Header, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { Fragment } from 'react';



export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { activitiesByDate, groupedActivities } = activityStore

    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>

                    {activities.map(activity => (
                        <ActivityListItem key={activity.id} activity={activity}></ActivityListItem>
                    ))}
                </Fragment>
            ))}
        </>
    )
})