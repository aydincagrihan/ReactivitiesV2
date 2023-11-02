import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name="search">
                    Hay Aksi! - Heryere baktık bulamadık !
                </Icon>
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/activities"> Aktiviteler Sayfasına Dön</Button>
            </Segment.Inline>
        </Segment>
    )
}