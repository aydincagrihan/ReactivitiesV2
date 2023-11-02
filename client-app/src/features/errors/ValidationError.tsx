import { Message, MessageList } from "semantic-ui-react";

interface Props{
    errors: string[];

}
//ErrorStatusCode "400" olanları kapsar
export default function ValidationError({errors}:Props){
    return(
        <Message error>
            {errors&&(
                <MessageList>
                    {errors.map((err:string,i)=>(
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </MessageList>
            )}
        </Message>
    )

}