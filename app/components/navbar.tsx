import { Avatar, Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, Wrap, WrapItem } from "@chakra-ui/react";
import logo from "../../public/images/CARGO-LOGO 1.png"
import { Link } from "@remix-run/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { redirect } from "@remix-run/node";

//Company -> FAQ, BVN • NIN 
//                    <Button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="21px" height="21px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg> <Text ml={2.5}>Sign in with Google</Text></Button>

export default function Navbar(props: any) {
    //console.log(props.session.user.user_metadata.avatar_url)

    const handleLogout = async () => {
        await props.supabase.auth.signOut()
        redirect("/")
    }

    return (
        <Flex flexWrap={"wrap"} w={"100%"} h={["fit-content", "fit-content", 50]}>
            <Box w={["100vw", "auto"]}><Link to={"/"}> <Image src={logo} height={50} mx={["auto", 0]}></Image> </Link></Box>
            <Wrap ml={["auto"]} height={["auto", "auto", 50]}>
                <WrapItem>
                    <Menu>
                        <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                            Company
                        </MenuButton>
                        <MenuList color={"#4299E1"}>
                            <Link to={"/company/faq"}><MenuItem>Frequently Asked Questions</MenuItem></Link>
                            <Link to={"/company/bvn"}><MenuItem>Banking Verification Number</MenuItem></Link>
                            <Link to={"/company/nin"}><MenuItem>National Identification Number</MenuItem></Link>
                            <Link to={"/company/nin"}><MenuItem>Drivers</MenuItem></Link>
                        </MenuList>
                    </Menu>
                </WrapItem>
                <WrapItem>
                    <Menu>
                        <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                            Packages
                        </MenuButton>
                        <MenuList color={"#4299E1"}>
                            <Link to={"/packages/my-packages"}><MenuItem>My Packages</MenuItem></Link>
                            <Link to={"/packages/add-package"}><MenuItem>Add Package</MenuItem></Link>
                        </MenuList>
                    </Menu>
                </WrapItem>
                <WrapItem>
                    <Menu>
                        <MenuButton as={Text} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                            Employee
                        </MenuButton>
                        <MenuList color={"#4299E1"}>
                            <Link to={"/company/bvn"}><MenuItem>Recent Packages</MenuItem></Link>
                            <Link to={"/company/faq"}><MenuItem>Shipments</MenuItem></Link>
                            <Link to={"/company/bvn"}><MenuItem>Customers</MenuItem></Link>
                        </MenuList>
                    </Menu>
                </WrapItem>
                <WrapItem minW={["100vw", 0]}>
                    {
                        props.session ?
                            <Menu>
                                <MenuButton as={Avatar} name='Kola Tioluwani' src={props.session.user.user_metadata.avatar_url} borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["20vw", 0]} mx={["auto", 0]} border={""} _hover={{ "border": "2px", "borderColor": "white", "color": "#4299E1" }}>
                                </MenuButton>
                                <MenuList color={"#4299E1"}>
                                    <Link to={"/company/faq"}><MenuItem>Account</MenuItem></Link>
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
                                    redirectTo="http://localhost:3000/auth/callback"
                                />
                            </Box>
                    }
                </WrapItem>
            </Wrap>
        </Flex>
    )
}