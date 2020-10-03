import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Icon, Loader } from 'rsuite';
import authHeader from '../../../Services/AuthHeader'
import { Table } from 'rsuite'
import { useHistory } from 'react-router-dom'
import useWindowDimensions from '../../../Hooks/windowDimensionHook';
import { RoleContext } from '../../../Context/UserRoleContext';

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

export default function ProductsContent(props) {
    const history = useHistory();
    const [products, setProducts] = useState(undefined);
    const role = useContext(RoleContext);
    const { width } = useWindowDimensions();

    const getProducts = async (role) => { const response = await Axios.get(process.env.REACT_APP_API_URL + `api/${role}/products`, { headers: authHeader() }); setProducts(response.data); }

    useEffect(() => {
        if (role.roles !== null) {
            let currentRole = role.roles.includes("ROLE_ADMIN") || role.roles.includes("ROLE_EMPLOYEE") ? 'employee' : 'user';
            getProducts(currentRole)
        }

    }, [role.roles])

    return (
        <div style={{ width: '100%' }}>
            {role.roles !== null && role.roles.includes("ROLE_ADMIN") ?
                <Button
                    onClick={() => history.push('/dashboard/product/new')}
                    appearance="primary"
                    style={{ margin: 20 }}>
                    Add new product <Icon icon="plus-square" style={{ marginLeft: 3 }} />
                </Button>
                :
                <Button
                    onClick={() => history.push('/dashboard/product/register')}
                    appearance="primary"
                    style={{ margin: 20 }}>
                    Register product <Icon icon="plus-square" style={{ marginLeft: 3 }} />
                </Button>
            }
            {products ?
                <Table
                    height={width > 768 ? 800 : 500}
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
                        <HeaderCell>Product Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>Serial Number</HeaderCell>
                        <Cell dataKey="serialNumber" />
                    </Column>
                    <Column width={200} resizable>
                        <HeaderCell>Name</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user === null ? "" : rowData.user.name}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={200}>
                        <HeaderCell>Owner Surname</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user === null ? "" : rowData.user.surname}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={300}>
                        <HeaderCell>Email</HeaderCell>
                        <Cell>
                            {(rowData, rowIndex) => {
                                return <p>{rowData.user === null ? "" : rowData.user.username}</p>;
                            }}
                        </Cell>
                    </Column>
                    <Column width={150} fixed="right">
                        <HeaderCell>Action</HeaderCell>
                        <Cell>
                            {rowData => {
                                function showIssues() {
                                    history.push(`/dashboard/product/${rowData.id}/issues`);
                                }
                                return (
                                    <span>
                                        <a onClick={showIssues}> Open issues </a>

                                    </span>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
                :
                <Loader />
            }
            {console.log(products)}
        </div>
    )
}
