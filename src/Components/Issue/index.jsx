import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios';
import authHeader from '../../Services/AuthHeader'
import { Button, Divider, Input, List, Panel, PanelGroup, Content, Icon, FlexboxGrid } from 'rsuite';
import priorityEnum from '../ProductIssues/priorityEnum';

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50px'
};

const titleStyle = {
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500
};

const dataStyle = {
    fontSize: '1.2em',
    fontWeight: 500
};

export default function Issue(props) {

    const history = useHistory();
    const [issue, setIssue] = useState(undefined);
    const [comments, setComments] = useState(undefined);
    const [message, setMessage] = useState(null);

    const getIssueData = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issue/${props.match.params.slug}`, { headers: authHeader() }); setIssue(response.data);
        const commentResponse = await Axios.get(process.env.REACT_APP_API_URL + `api/issue/${props.match.params.slug}/comments`, { headers: authHeader() }); setComments(commentResponse.data);
    }

    useEffect(() => {
        getIssueData();
    }, [])

    // useEffect(() => {
    //     addComment();
    // }, [comments])

    const addComment = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issue/${props.match.params.slug}`, { headers: authHeader() })
            .then(
                (response) => {
                    if (response.status === 200) {
                        setComments(response.data);
                    }
                }
            )
            .catch(
                (error) => {
                    setMessage(error.message)
                }
            );
    }

    return (
        <Content style={{ padding: '20px' }}>
            <Button appearance='ghost' style={{ marginBottom: 10 }} onClick={() => history.push(`/dashboard/products`)}><Icon icon='back-arrow' /> Go to products</Button>
            <PanelGroup accordion bordered>
                <Panel header={issue ? `Issue name: ${issue.name}` : 'Loading Issue'} defaultExpanded collapsible={false}>

                    {console.log(comments)}
                    {issue ?
                        <>
                            <p><b>Issue description:</b> {issue.description}</p>
                            <p><b>Opened by:</b> {issue.user.username}</p>
                            <p><b>Assigned to:</b> {issue.employee ? issue.employee.username : 'Unasigned'}</p>
                            <p><b>Priority:</b> {priorityEnum[issue.priority]}</p>
                            <p><b>Current status:</b> {issue.solved ? 'Solved' : 'Not Solved'}</p>
                        </>
                        :
                        <p>please wait</p>
                    }
                </Panel>

                <Panel header='Comments'>
                    {comments ?
                        <List hover>
                            {comments.map((item, index) => (
                                <List.Item key={item['id']} index={index}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item colspan={2} style={styleCenter}>
                                            <Icon
                                                icon={item['icon']}
                                                style={{
                                                    color: 'darkgrey',
                                                    fontSize: '1.5em'
                                                }}
                                            />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item
                                            colspan={8}
                                            style={{
                                                ...styleCenter,
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div style={titleStyle}>
                                                <div>
                                                    <Icon icon="user-circle-o" />
                                                    {' ' + item['user']['username']}
                                                </div>
                                                <div>{item['date']}</div>
                                            </div>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                            <div>
                                                {/* <div style={slimText}>Comment</div> */}
                                                <div style={dataStyle}>{item.content}</div>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            ))}
                        </List>
                        :
                        <p>wait</p>
                    }
                    {/* <p>here you should add new comment</p> */}
                    <Divider style={{ margin: '20px 5px' }} />
                    <Input
                        componentClass="textarea"
                        rows={3}
                        style={{ width: 300, resize: 'auto', maxWidth: 600 }}
                        placeholder="Add a new comment"
                    />
                    <Button onClick={() => addComment()} appearance='primary'>Add Comment</Button>
                </Panel>
            </PanelGroup>
        </Content>
    )
}
