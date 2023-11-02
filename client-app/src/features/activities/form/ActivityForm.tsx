import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';
import { Form, Formik, Field } from 'formik';



export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore

    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: '',
    });

    useEffect(() => {
        //activitiy "!" sonuna koymamın nedeni bu ifadenin null or undefined 
        //olmayacağı anlamına gelir yoksa tip güvenliğinden hata return ediyordu
        //TypeScript functionality kapatmak için ! kullanılır
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])


    // const [activity,setActivity]=useState(initialState);

    // function handleSubmit() {
    //     if (!activity.id) {
    //         activity.id = uuid();
    //         createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    //     }
    //      else
    //      {
    //         updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))

    //     }
    // }

    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     const { name, value } = event.target;
    //     setActivity({ ...activity, [name]: value });
    // }

    if (loadingInitial) return <LoadingComponent content='Aktivite Yükleniyor...' />

    return (
        //enableReinitialize formu kullanırken initialvalueleride basar forma.
        <Segment clearing>
            <Formik enableReinitialize initialValues={activity} onSubmit={values => console.log(values)}>
                {({ handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Field placeholder="Title"  name="title"/>
                        <Field placeholder="Description" name="description" />
                        <Field placeholder="Category" name="category" />
                        <Field type='date' placeholder="Date" name="date" />
                        <Field placeholder="City" name="city" />
                        <Field placeholder="Venue" name="venue" />
                        <Button floated='right' loading={loading} positive type="submit" content="Submit" />
                        <Button as={Link} to='/activities' floated='right' type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})