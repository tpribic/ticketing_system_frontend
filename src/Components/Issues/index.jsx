import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { Button, Icon, Loader, Table } from 'rsuite';
import authHeader from '../../Services/AuthHeader'
import { useContext } from 'react';
import { RoleContext } from '../../Context/UserRoleContext';
import useWindowDimensions from '../../Hooks/windowDimensionHook';

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Issues(props) {
    const history = useHistory();
    const [issues, setIssues] = useState(undefined);
    const role = useContext(RoleContext);
    const {width} = useWindowDimensions()

    const getAllIssues = async () => { const response = await Axios.get(process.env.REACT_APP_API_URL + 'api/employee/issues', { headers: authHeader() }); setIssues(response.data); }
    const getUserIssues = async () => { const response = await Axios.get(process.env.REACT_APP_API_URL + 'api/user/issues', { headers: authHeader() }); setIssues(response.data); }

    useEffect(() => {
        if (role.roles !== null) {
            role.roles.includes("ROLE_ADMIN") || role.roles.includes("ROLE_EMPLOYEE")
                ?
                getAllIssues()
                :
                getUserIssues()
        }

    }, [role.roles])

    return (
        <div style={{ width: '100%' }}>
            <Button
                onClick={() => history.push('/dashboard/issue/new')}
                appearance="primary"
                style={{ margin: 20 }}>
                Open new issue <Icon icon="plus-square" style={{ marginLeft: 3 }} />
            </Button>
            {issues ?
                <Table
                    height={width > 768 ? 800 : 500}
                    data={issues}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={70} align="center" fixed>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>
                    <Column width={200} resizable>
                        <HeaderCell>Issue Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>Product Serial Number</HeaderCell>
                        <Cell dataKey="serialNumber" />
                    </Column>
                    <Column width={200} resizable>
                        <HeaderCell>Owner Name</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user.name}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={200}>
                        <HeaderCell>Owner Surname</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user.surname}</p>;
                            }}
                        </Cell>
                    </Column>

                    <Column width={300}>
                        <HeaderCell>Email</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user.username}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={150} fixed="right">
                        <HeaderCell>Action</HeaderCell>

                        <Cell>
                            {rowData => {
                                function showDetails() {
                                    history.push(`/dashboard/issue/${rowData.id}`);
                                }
                                return (
                                    <span>
                                        <a onClick={showDetails}> Details </a>
                                    </span>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
                :
                <Loader />
            }
        </div>
    );
}
