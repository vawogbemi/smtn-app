import { Avatar, Box, Card, CardHeader, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { isEmployee } from "~/utils/utils";
import logo from "../../public/images/CARGO-LOGO 1.png";


export default function Navbar(props: any) {
    //console.log(props.session.user.user_metadata.avatar_url)

    const handleLogout = async () => {
        await props.supabase.auth.signOut()
        return redirect("/")
    }


    return (
        <Flex flexWrap={"wrap"} w={"100%"} h={["fit-content", "fit-content", 50]}>
            <Box w={["100vw", "auto"]}><Link to={"/"}> <Image src={logo} height={59} mx={["auto", 0]}></Image> </Link></Box>
            <Wrap ml={["auto"]} height={["auto", "auto", 50]}>
                <WrapItem>
                    <Menu>
                        <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                            <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Company</Text>
                        </MenuButton>
                        <MenuList color={"#4299E1"}>
                            <Link to={"/company/faq"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Frequently Asked Questions</MenuItem></Link>
                            <Link to={"/company/bvn"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Banking Verification Number</MenuItem></Link>
                            <Link to={"/company/nin"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>National Identification Number</MenuItem></Link>
                            <Link to={"/company/nin"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Drivers</MenuItem></Link>
                        </MenuList>
                    </Menu>
                </WrapItem>
                {props.session ?
                    <WrapItem>
                        <Menu>
                            <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                                <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Cargo</Text>
                            </MenuButton>
                            <MenuList color={"#4299E1"}>
                                <Link to={"/cargo/my-cargo"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>My Cargo</MenuItem></Link>
                                <Link to={"/cargo/add"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Add Cargo</MenuItem></Link>
                            </MenuList>
                        </Menu>
                    </WrapItem> :
                    <></>}
                {props.session && isEmployee(props.session.user.id) ?
                    <WrapItem>
                        <Menu>
                            <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                                <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Employee</Text>
                            </MenuButton>
                            <MenuList color={"#4299E1"}>
                                <Link to={"/employee/boxes"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Boxes</MenuItem></Link>
                                <Link to={"/company/faq"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Shipments</MenuItem></Link>
                                <Link to={"/company/bvn"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Customers</MenuItem></Link>
                            </MenuList>
                        </Menu>
                    </WrapItem> :
                    <></>}
                <WrapItem minW={["100vw", 0]}>
                    {
                        props.session ?
                            <Menu>
                                <MenuButton as={Avatar} name={props.session.user.user_metadata.name} src={props.session.user.user_metadata.avatar_url} borderRadius={5} px={5} py={25} my={"auto"} minW={["20vw", 0]} mx={["auto", 0]} border={""} _hover={{ "border": "2px", "borderColor": "white", "color": "#4299E1" }}>
                                </MenuButton>
                                <MenuList color={"#4299E1"}>
                                    <Card mb={1} bg={"#4299E1"}><CardHeader><Text color={"white"}>{props.users[props.session.user.id] ? props.users[props.session.user.id].at(0).name : props.session.user.user_metadata.name}</Text></CardHeader></Card>
                                    <Link to={"/account"}><MenuItem>Account</MenuItem></Link>
                                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                </MenuList>
                            </Menu> :
                            <Box mx={["auto", 0]}>
                                <Auth
                                    supabaseClient={props.supabase}
                                    onlyThirdPartyProviders={true}
                                    appearance={{ theme: ThemeSupa }}
                                    theme="dark"
                                    showLinks={false}
                                    providers={['google']}
                                    redirectTo={process.env.NODE_ENV == "development" ? "http://localhost:3000/auth/callback" : "https://smtn-app.fly.dev/auth/callback"}
                                />
                            </Box>
                    }
                </WrapItem>
            </Wrap>
        </Flex>
    )
}