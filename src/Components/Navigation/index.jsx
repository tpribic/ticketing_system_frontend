import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Dropdown, Icon, Container, Sidenav, IconButton, Drawer, ButtonToolbar, Button, Sidebar, Header, Content, Divider } from 'rsuite';
import AuthService from '../../Services/AuthService';
import { Link, Redirect, Route, Switch, useHistory } from "react-router-dom";
import useWindowDimensions from '../../Hooks/windowDimensionHook';
import jwt_decode from 'jwt-decode';
import ProductsContent from '../Product/ProductsContent'
import AddUserForm from "../AddUserForm";
import ProductIssues from "../Product/ProductIssues"
import IssueDetails from "../Issues/IssueDetails";
import Issues from "../Issues";
import NewIssueForm from "../Issues/NewIssueForm";
import { RoleContext } from "../../Context/UserRoleContext";

const NavigationInstance = ({ onSelect, activeKey, ...props }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [username, setUsername] = useState(undefined);
    const [toggleSideNav, setToggleSideNav] = useState(false);
    const role = useContext(RoleContext);

    const history = useHistory();
    const { width } = useWindowDimensions();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setIsLoading(true);
            const decodedUser = jwt_decode(user.token);
            setCurrentUser(user);
            role.setRoles(decodedUser.roles);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const decodedUser = jwt_decode(currentUser.token);
            setUsername(decodedUser.username);
        }
    }, [currentUser])

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        history.push('/login')
    };

    return (
        <>
        {console.log(role)}
            <Header>
                <Navbar {...props}>
                    <Navbar.Body>
                        <Nav pullRight>
                            {currentUser === undefined ?
                                null
                                :
                                <Dropdown title={username} icon={<Icon icon="user" />}>
                                    {/* <Dropdown.Item eventKey="4" icon={<Icon icon="cog" />}>Profile settings</Dropdown.Item> */}
                                    <Dropdown.Item eventKey="5" icon={<Icon icon="sign-out" />} onClick={logOut}>Logout</Dropdown.Item>
                                </Dropdown>
                            }
                        </Nav>
                        <Nav>
                            {
                                width < 768 && currentUser ?
                                    <Nav.Item icon={<Icon icon="align-justify" />} onClick={() => setToggleSideNav(!toggleSideNav)}></Nav.Item>
                                    :
                                    null
                            }
                        </Nav>
                    </Navbar.Body>
                </Navbar>
            </Header>
            <Container>
                {currentUser && width > 767 ?
                    <Sidebar style={{ display: 'flex', flexDirection: 'column' }}>
                        <Sidenav onSelect={onSelect} activeKey={activeKey} style={{ width: 250, height: 'calc(100vh - 56px)' }}>
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item eventKey="1" componentClass={Link} to="/dashboard" icon={<Icon icon="dashboard" />}>
                                        Dashboard
                                </Nav.Item>
                                    <Nav.Item eventKey="2" componentClass={Link} to="/dashboard/products" icon={<Icon icon="cubes" />}>
                                        Products
                                </Nav.Item>
                                    <Nav.Item eventKey="3" componentClass={Link} to="/dashboard/issues" icon={<Icon icon="ticket" />}>
                                        Issues
                                </Nav.Item>
                                    <Divider />
                                    {/* {!isLoading && role.roles.includes("ROLE_ADMIN") ?
                                        <Nav.Item eventKey="4" componentClass={Link} to="/dashboard/admin/add" icon={<Icon icon="user-plus" />}>
                                            Add new Employee
                                            </Nav.Item>
                                        :
                                        null
                                    } */}
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </Sidebar>
                    :
                    <Container>
                        <Drawer
                            placement={'left'}
                            show={toggleSideNav}
                            onHide={() => setToggleSideNav(false)}
                            style={{ width: 250 }}
                        >
                            <Drawer.Header>
                                <Drawer.Title>Menu</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body >
                                <Nav vertical onSelect={onSelect} activeKey={activeKey} appearance='subtle'>
                                    <Nav.Item eventKey="1" componentClass={Link} to="/dashboard" icon={<Icon icon="dashboard" />}>
                                        Dashboard
                                </Nav.Item>
                                    <Nav.Item eventKey="2" componentClass={Link} to="/dashboard/products" icon={<Icon icon="cubes" />}>
                                        Products
                                </Nav.Item>
                                    <Nav.Item eventKey="3" componentClass={Link} to="/dashboard/Issues" icon={<Icon icon="ticket" />}>
                                        Issues
                                </Nav.Item>
                                    <Divider />

                                    {/* {!isLoading && role.roles.includes("ROLE_EMPLOYEE") ?
                                        <Nav.Item eventKey="4" componentClass={Link} to="/dashboard/admin/add" icon={<Icon icon="user-plus" />}>
                                            Add new Employee
                                            </Nav.Item>
                                        :
                                        null
                                    } */}
                                </Nav>
                            </Drawer.Body>
                        </Drawer>
                    </Container>
                }
                <Container>
                    <Content style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <Switch>
                            {/* function hue(props) { return <p>hej hej issue {props.match.params.slug}</p> } */}
                            <Route exact path="/dashboard" component={function hue() { return (<p>Napraviti prikaz koliko produkata ima i koliko ima issue-a?</p>) }} />
                            <Route exact path="/dashboard/products" component={ProductsContent} />
                            <Route exact path="/dashboard/product/new" component={function hue() { return (<p>Hue hue new product</p>) }} />
                            <Route exact path="/dashboard/product/register" component={function hue() { return (<p>Hue hue new product</p>) }} />
                            <Route exact path="/dashboard/product/:slug/issues" component={ProductIssues} />
                            <Route exact path="/dashboard/issues" component={Issues} />
                            <Route exact path="/dashboard/issue/new" component={NewIssueForm} />
                            <Route exact path="/dashboard/issue/:slug" component={IssueDetails} />
                            {/* <Route exact path="/dashboard/admin/" component={function hue() { return <p>admin area</p> }} /> */}
                            <Route exact path="/dashboard/admin/add" component={AddUserForm} />
                            <Route component={function hue() { return <p>You really shouldn't try to mess with the URL...</p> }} />
                        </Switch>
                    </Content>
                </Container>
            </Container>
        </>
    );
};

export default NavigationInstance;