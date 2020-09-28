import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Icon } from 'rsuite';
import authHeader from '../../Services/AuthHeader'
import { Table } from 'rsuite'
import { useHistory } from 'react-router-dom'
import priorityEnum from './priorityEnum'

const { Column, HeaderCell, Cell, Pagination } = Table;

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
};

const slimText = {
    fontSize: '0.666em',
    color: '#97969B',
    fontWeight: 'lighter',
    paddingBottom: 5
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


export default function ProductIssues(props) {

    const history = useHistory();
    const [productIssues, setProductIssues] = useState(undefined);

    const getProductIssues = async () => { const response = await Axios.get(process.env.REACT_APP_API_URL + `api/user/product/${props.match.params.slug}/issues`, { headers: authHeader() }); setProductIssues(response.data); }

    useEffect(() => {
        getProductIssues();
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <Button
                appearance="primary"
                style={{ margin: 20 }}>
                Add new issue <Icon icon="plus-square" style={{ marginLeft: 3 }} />
            </Button>
            {productIssues ?
                <Table
                    autoHeight={true}
                    data={productIssues}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={70} fixed>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>
                    <Column width={70} align="center" fixed>
                        <HeaderCell>Priority</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{priorityEnum[rowData.priority]}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={200} resizable>
                        <HeaderCell>Issue Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>Name</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user.name}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={200}>
                        <HeaderCell>Assigned to</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return rowData.employee ?
                                    <p>{rowData.user.username}</p>
                                    :
                                    "Unasigned"
                            }}
                        </Cell>
                    </Column>

                    <Column width={300}>
                        <HeaderCell>Opened By</HeaderCell>
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
                                function showIssue() {
                                    history.push(`/dashboard/issue/${rowData.id}`);
                                }
                                return (
                                    <span>
                                        <a onClick={showIssue}> Details </a>
                                    </span>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
                :
                <p>Please wait</p>
            }
        </div>
    )
}
