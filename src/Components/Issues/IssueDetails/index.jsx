import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios';
import authHeader from '../../../Services/AuthHeader'
import { Button, Divider, ButtonToolbar, List, Panel, PanelGroup, Content, Icon, FlexboxGrid, Loader, Form, Schema, FormGroup, ControlLabel, FormControl } from 'rsuite';
import priorityEnum from '../../Product/ProductIssues/priorityEnum';

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50px'
};

const commentStyle = {
    display: 'flex',
    alignItems: 'center',
    minHeight: '50px'
}

const titleStyle = {
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500
};

const dataStyle = {
    textAlign: 'left',
    fontWeight: 500
};

export default function IssueDetails(props) {

    const history = useHistory();
    const [issue, setIssue] = useState(undefined);
    const [comments, setComments] = useState(undefined);
    const [comment, setComment] = useState(null);
    const [formError, setFormError] = useState({});
    const form = useRef(null);

    const { StringType } = Schema.Types;
    const commentModel = Schema.Model({
        comment: StringType().minLength(2, 'Comment too short.').maxLength(255, 'Too many characters.'),
    });


    const getIssueData = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issue/${props.match.params.slug}`, { headers: authHeader() }); setIssue(response.data);
        const commentResponse = await Axios.get(process.env.REACT_APP_API_URL + `api/issue/${props.match.params.slug}/comments`, { headers: authHeader() }); setComments(commentResponse.data);
    }

    useEffect(() => {
        getIssueData();
    }, [])

    const addComment = async (event) => {
        event.preventDefault();
        if (!form.current.check()) {
            return console.log('Whoops! Form was submitted invalid!');
        }
        const commentData = await Axios.post(process.env.REACT_APP_API_URL + `api/comment/${props.match.params.slug}`, { content: comment }, { headers: authHeader() });
        getIssueData();
    }

    return (
        <Content style={{ padding: '20px' }}>
            <Button appearance='ghost' style={{ marginBottom: 10 }} onClick={() => history.push(`/dashboard/issues`)}><Icon icon='back-arrow' /> Go to issues</Button>
            <PanelGroup accordion bordered>
                <Panel header={issue ? `Issue name: ${issue.name}` : 'Loading Issue'} defaultExpanded collapsible={false}>
                    {issue ?
                        <>
                            <p><b>Issue description:</b> {issue.description}</p>
                            <p><b>Opened by:</b> {issue.user.username}</p>
                            <p><b>Assigned to:</b> {issue.employee ? issue.employee.username : 'Unasigned'}</p>
                            <p><b>Priority:</b> {priorityEnum[issue.priority]}</p>
                            <p><b>Current status:</b> {issue.solved ? 'Solved' : 'Not Solved'}</p>
                        </>
                        :
                        <Loader />
                    }
                </Panel>

                <Panel header='Comments'>
                    {comments ?
                        <List style={{ maxHeight: 300, width: 'inherit' }} hover autoScroll>
                            {comments.map((item, index) => (
                                <List.Item key={item['id']} index={index}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item style={styleCenter}>
                                            <Icon
                                                icon={item['icon']}
                                                style={{
                                                    color: 'darkgrey',
                                                    fontSize: '1.5em'
                                                }}
                                            />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item
                                            colspan={6}
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
                                        <FlexboxGrid.Item colspan={1}
                                            style={{
                                                ...styleCenter,
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Divider vertical />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={12} style={commentStyle}>
                                            <p style={dataStyle}>{item.content}</p>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            ))}
                        </List>
                        :
                        <Loader />
                    }
                    <Divider style={{ margin: '20px 5px' }} />
                    <Form
                        model={commentModel}
                        onCheck={formError => {
                            setFormError(formError);
                        }}
                        ref={form}
                    >
                        <FormGroup>
                            {/* <ControlLabel>Comment</ControlLabel> */}
                            <FormControl placeholder='Write a comment...' rows={3} name="comment" componentClass="textarea" onChange={(value) => setComment(value)} />
                        </FormGroup>
                        <ButtonToolbar>
                            <Button disabled={formError.comment !== undefined} appearance="primary" onClick={(event) => addComment(event)}>Submit</Button>
                        </ButtonToolbar>
                    </Form>
                </Panel>
            </PanelGroup>
        </Content>
    )
}
