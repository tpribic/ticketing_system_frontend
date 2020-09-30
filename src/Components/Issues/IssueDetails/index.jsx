import React, { useState, useEffect, useRef, useContext, Children } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios';
import authHeader from '../../../Services/AuthHeader'
import { Button, Divider, ButtonToolbar, List, Panel, PanelGroup, Content, Icon, FlexboxGrid, Loader, Form, Schema, FormGroup, FormControl, InputPicker } from 'rsuite';
import priorityEnum from '../../Product/ProductIssues/priorityEnum';
import { RoleContext } from '../../../Context/UserRoleContext';
import { priority, isSolved } from './rsuiteConstants'

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

const BoldText = (props) => {
    return (
        <p style={{ fontWeight: 'bold' }}>{props.children}</p>
    )
}

export default function IssueDetails(props) {

    const history = useHistory();
    const [message, setMessage] = useState(null);
    const [issue, setIssue] = useState(undefined);
    const [comments, setComments] = useState(undefined);
    const [comment, setComment] = useState("");
    const [formError, setFormError] = useState({});
    const [employees, setEmployees] = useState(null);
    const [formData, setFormData] = useState({
        issueId: parseInt(props.match.params.slug),
        employeeId: null,
        priority: 1,
        isSolved: false
    });
    const form = useRef(null);
    const role = useContext(RoleContext);

    const { StringType } = Schema.Types;
    const commentModel = Schema.Model({
        comment: StringType().minLength(2, 'Comment too short.').maxLength(255, 'Too many characters.'),
    });

    useEffect(() => {
        getIssueData();

    }, [])

    useEffect(() => {
        if (role.roles !== null) {
            if (role.roles.includes("ROLE_EMPLOYEE") || role.roles.includes("ROLE_ADMIN")) {
                getEmployees();
            }
        }
    }, [role.roles])


    const getIssueData = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issue/${props.match.params.slug}`, { headers: authHeader() }); setIssue(response.data);
        const commentResponse = await Axios.get(process.env.REACT_APP_API_URL + `api/issue/${props.match.params.slug}/comments`, { headers: authHeader() }); setComments(commentResponse.data);
    }

    const updateIssueData = async () => {
        const response = await Axios.patch(process.env.REACT_APP_API_URL + `api/employee/issue/update`, formData, { headers: authHeader() })
            .then((response) => {
                setIssue(response.data)
                setMessage("Issue updated");
            })
            .catch((error) => {
                setMessage(error.message)
            });

    }

    const getEmployees = async () => {
        const response = await Axios.get(process.env.REACT_APP_API_URL + `api/employee/all`, { headers: authHeader() });

        let formatedData = [{
            label: "Unasigned",
            value: null,
            role: "Unasigned",
        }];

        response.data.forEach(employee => {
            formatedData.push({
                label: employee.username,
                value: employee.id,
                role: "Employee",
            })
        });

        setEmployees(formatedData);
    }

    const addComment = async (event) => {
        event.preventDefault();
        if (!form.current.check()) {
            return console.log('Whoops! Form was submitted invalid!');
        }
        const commentData = await Axios.post(process.env.REACT_APP_API_URL + `api/comment/${props.match.params.slug}`, { content: comment }, { headers: authHeader() });
        setComment("");
        getIssueData();
    }
    return (
        <Content style={{ padding: '20px', maxHeight: '92vh', overflowX: 'auto' }} >
            <Button appearance='ghost' style={{ marginBottom: 10 }} onClick={() => history.push(`/dashboard/issues`)}><Icon icon='back-arrow' /> Go to issues</Button>
            <PanelGroup accordion bordered>
                <Panel header={issue ? `Issue name: ${issue.name}` : 'Loading Issue'} defaultExpanded collapsible={false}>
                    {issue ?
                        role.roles.includes("ROLE_EMPLOYEE") || role.roles.includes("ROLE_ADMIN") ?
                            <>
                                <FlexboxGrid style={{ justifyContent: 'flex-start' }}>
                                    <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                        <BoldText>Issue description:</BoldText>
                                        <p style={{ maxWidth: 200 }}>{issue.description}</p>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                        <BoldText>Opened by:</BoldText>
                                        <p>{issue.user.username}</p>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                        <BoldText>Assigned to:</BoldText>
                                        {employees ?
                                            <InputPicker
                                                style={{ margin: '5px 0' }}
                                                defaultValue={issue.employee ? issue.employee.id : null}
                                                data={employees}
                                                block
                                                cleanable={false}
                                                onChange={(value) => setFormData({ ...formData, employeeId: value })}
                                            />
                                            :
                                            null
                                        }
                                        <BoldText>Priority:</BoldText>
                                        <InputPicker
                                            style={{ margin: '5px 0' }}
                                            defaultValue={issue.priority}
                                            data={priority}
                                            block
                                            cleanable={false}
                                            onChange={(value) => setFormData({ ...formData, priority: value })}
                                        />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                        <BoldText>Current status:</BoldText>
                                        <InputPicker
                                            style={{ margin: '5px 0' }}
                                            defaultValue={issue.solved}
                                            data={isSolved}
                                            block
                                            cleanable={false}
                                            onChange={(value) => setFormData({ ...formData, isSolved: value })}
                                        />
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                <div style={{ width: '100%', margin: '10px 0 5px 0' }}>
                                    <Button
                                        appearance={"primary"}
                                        onClick={() => updateIssueData()}
                                    >
                                        Apply changes
                                    </Button>
                                </div>
                                {message}
                            </>
                            :
                            <FlexboxGrid style={{ justifyContent: 'space-around' }}>
                                <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                    <BoldText>Issue description:</BoldText>
                                    <p>{issue.description}</p>
                                    <BoldText>Opened by:</BoldText>
                                    <p>{issue.user.username}</p>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                    <BoldText>Assigned to:</BoldText>
                                    <p>{issue.employee ? issue.employee.username : 'Unasigned'}</p>
                                    <BoldText>Priority:</BoldText>
                                    <p>{priorityEnum[issue.priority]}</p>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item style={{ margin: '5px 10px', minWidth: 200 }}>
                                    <BoldText>Current status:</BoldText>
                                    <p>{issue.solved ? 'Solved' : 'Not Solved'}</p>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        :
                        <Loader />
                    }
                </Panel>

                <Panel header='Comments' >
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
                                            // colspan={6}
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
                                        <FlexboxGrid.Item
                                            // colspan={1}
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
                            <FormControl style={{ minWidth: 250 }} placeholder='Write a comment...' rows={3} name="comment" componentClass="textarea" onChange={(value) => setComment(value)} value={comment} />
                        </FormGroup>
                        <ButtonToolbar>
                            <Button disabled={formError.comment !== undefined} appearance="primary" onClick={(event) => addComment(event)}>Submit</Button>
                        </ButtonToolbar>
                    </Form>
                </Panel>
            </PanelGroup>
            {console.log(formData)}
        </Content >
    )
}
