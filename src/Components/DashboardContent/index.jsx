import React, { useEffect, useState, useContext } from 'react'
import { Button, Content, FlexboxGrid, Loader, Panel } from 'rsuite'
import Axios from 'axios';
import authHeader from '../../Services/AuthHeader';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { RoleContext } from '../../Context/UserRoleContext';
import { useHistory } from 'react-router-dom';

export default function DashboardContent(props) {

    const [isLoading, setIsLoading] = useState(true)
    const [issues, setIssues] = useState(null)
    const [solvedIssues, setSolvedIssues] = useState(null)
    const [products, setProducts] = useState(null)
    const [registeredProducts, setRegisteredProducts] = useState(null)
    const history = useHistory();
    const role = useContext(RoleContext)


    useEffect(() => {
        if (role.roles !== null) {
            if (role.roles.includes("ROLE_ADMIN") || role.roles.includes("ROLE_EMPLOYEE")) {
                getAdminDashboardData();
            }
            else {
                getUserDashboardData();
            }
        }
    }, [role.roles])

    const getUserDashboardData = async () => {
        const issues = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issues`, { headers: authHeader() });
        const solvedIssues = await Axios.get(process.env.REACT_APP_API_URL + `api/user/issues/solved`, { headers: authHeader() });
        const products = await Axios.get(process.env.REACT_APP_API_URL + `api/user/products`, { headers: authHeader() });
        setIssues(issues.data.length);
        setSolvedIssues(solvedIssues.data.length);
        setProducts(products.data.products.length);
        setIsLoading(false);
    }

    const getAdminDashboardData = async () => {
        const issues = await Axios.get(process.env.REACT_APP_API_URL + `api/employee/issues`, { headers: authHeader() });
        const solvedIssues = await Axios.get(process.env.REACT_APP_API_URL + `api/employee/issues/solved`, { headers: authHeader() });
        const products = await Axios.get(process.env.REACT_APP_API_URL + `api/employee/products`, { headers: authHeader() });
        const registeredProducts = await Axios.get(process.env.REACT_APP_API_URL + `api/employee/products/active`, { headers: authHeader() });
        setIssues(issues.data.length);
        setSolvedIssues(solvedIssues.data.length);
        setProducts(products.data.length);
        setRegisteredProducts(registeredProducts.data.length);
        setIsLoading(false);
    }

    const COLORS = ['#0088FE', '#00C49F'];
    const pieProductData = [{ 'name': "Unregistered", "value": products - registeredProducts }, { "name": "Registered", "value": registeredProducts }];
    const pieIssueData = [{ 'name': "Opened", "value": issues - solvedIssues }, { "name": "Solved issues", "value": solvedIssues }];

    return (
        <Content style={{ overflow: 'auto', maxHeight: '90vh' }}>
            <FlexboxGrid style={{ justifyContent: 'center' }}>
                {isLoading ?
                    <Loader />
                    :
                    <>
                        <Panel
                            style={{ margin: 20, minHeight: 420, minWidth: 300, textAlign: "center" }}
                            bordered
                        >
                            <h4>Products</h4>
                            {products === 0 ?
                                <FlexboxGrid style={{ justifyContent: 'center', height: 'inherit' }}>
                                    <FlexboxGrid.Item style={{ display: 'flex', flexDirection: 'column', height: 300, justifyContent: 'center', alignItems: 'center' }}>
                                        <Button onClick={() => { history.push('/dashboard/product/register') }} appearance="primary">Register a product</Button>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                :
                                role.roles.includes('ROLE_EMPLOYEE') || role.roles.includes('ROLE_ADMIN') ?
                                    <>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={pieProductData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={70}
                                                    fill="#8884d8"
                                                >
                                                    {
                                                        pieProductData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                                    }
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <h5>
                                            Product sum
                                                </h5>
                                        <h5>
                                            {products}
                                        </h5>
                                    </>
                                    :
                                    <>
                                        <FlexboxGrid style={{ justifyContent: 'center', height: 'inherit' }}>
                                            <FlexboxGrid.Item style={{ display: 'flex', flexDirection: 'column', height: 300, justifyContent: 'center', alignItems: 'center' }}>

                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <Button appearance="primary">Register new product</Button>
                                    </>
                            }
                        </Panel>
                        <Panel
                            style={{ margin: 20, minHeight: 420, minWidth: 300, textAlign: "center" }}
                            bordered
                        >
                            <h4>Issues</h4>
                            {
                                issues !== 0 ?
                                    <>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={pieIssueData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={70}
                                                    fill="#8884d8"
                                                >
                                                    {
                                                        pieIssueData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                                    }
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <FlexboxGrid style={{ justifyContent: 'center' }}>
                                            <FlexboxGrid.Item style={{ display: 'flex', flexDirection: 'column' }}>
                                                <h5>
                                                    Issue sum
                                            </h5>
                                                <h5>
                                                    {issues}
                                                </h5>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </>
                                    :
                                    <>
                                        <FlexboxGrid style={{ justifyContent: 'center', height: 'inherit' }}>
                                            <FlexboxGrid.Item style={{ display: 'flex', flexDirection: 'column', height: 300, justifyContent: 'center', alignItems: 'center' }}>
                                                <h5>
                                                    You have no open issues yet.
                                            </h5>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </>
                            }

                        </Panel>
                    </>
                }
            </FlexboxGrid>
        </Content>
    )
}
