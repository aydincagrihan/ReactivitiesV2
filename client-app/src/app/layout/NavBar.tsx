import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';


interface Props{
    openForm: ()=>void;
}

export default function NavBar(props: Props) {
    return (

        <Menu
            inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:10}} />
                    Han
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item >
                    <Button
                        content="Create Activitiy"
                        positive
                        onClick={props.openForm}
                    ></Button>

                </Menu.Item>
            </Container>

        </Menu>
    )
}