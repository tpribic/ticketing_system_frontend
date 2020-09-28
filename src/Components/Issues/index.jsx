import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { Button, Icon, Loader, Table } from 'rsuite';
import authHeader from '../../Services/AuthHeader'

const { Column, HeaderCell, Cell, Pagination } = Table;

export default function Issues(props) {
    const history = useHistory();
    const [products, setProducts] = useState(undefined);

    const getProducts = async () => { const response = await Axios.get(process.env.REACT_APP_API_URL + 'api/employee/issues', { headers: authHeader() }); setProducts(response.data); }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <Button
                onClick={() => history.push('/dashboard/issue/new')}
                appearance="primary"
                style={{ margin: 20 }}>
                Open new issue <Icon icon="plus-square" style={{ marginLeft: 3 }} />
            </Button>
            {products ?
                <Table
                    autoHeight={true}
                    data={products}
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
