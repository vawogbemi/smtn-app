import { CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, createIcon, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { supabase } from "@supabase/auth-ui-shared";
import { Database } from "database.types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormControl, InputControl, SelectControl } from "react-hook-form-chakra";
import * as Yup from "yup";
import CountryCodeSelector from "./countrycodeselector";



export default function LoginForm(props: any) {
    const toast = useToast()

    const [show, setShow] = useState(false)

    const handleClick = () => setShow(!show)

    const [other, setOther] = useState(false)

    const toggleOther = () => setOther(!other)


    const submit = useSubmit()


    const ValidationSchema = Yup.object({
        country_code: Yup.string().required("Country code is required"),
        other: Yup.string(),
        phone: Yup.string().min(3).required("Phone is required"),
        password: Yup.string().min(3).required("Password is required"),
    })

    const DefaultValues = {
        country_code: "",
        other: "",
        phone: "",
        password: "",
    }

    const { handleSubmit, control, getValues, formState: { errors, touchedFields } } = useForm({ resolver: yupResolver(ValidationSchema), defaultValues: DefaultValues, mode: "onBlur" })

    return (
        <Box w={"90vw"} bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} maxH={"80vh"} >
            <Flex>
                <IconButton aria-label="close" icon={<CloseIcon />} ml={"auto"} bg="white" onClick={() => props.setLogin(false)}></IconButton>
            </Flex>
            <Form method="post" onSubmit={handleSubmit((data: any) => {
                props.supabase.auth.signInWithPassword({ phone: other ? `${getValues("other")}${getValues("phone")}`: `${getValues("country_code")}${getValues("phone")}`, password: getValues("password") }).then(({ error }: any) => {
                    if (error) {
                        toast({
                            title: 'Something went wrong.',
                            description: `Error: ${error}. Please try again or contact us.`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                    else {
                        props.setLogin(false);
                        submit({ ...data },
                            {
                                action: "/",
                                method: "post",
                            })
                    }
                }).catch(({ error }: any) =>
                    toast({
                        title: 'Something went wrong.',
                        description: `Error: ${error}. Please try again or contact us.`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                );

            })}>
                <Flex>
                    <Heading mx={"auto"}>Login</Heading>
                </Flex>
                <CountryCodeSelector control={control} other={other} setOther={setOther} getValues={getValues} />
                <InputControl name="phone" label="Phone Number" control={control} mt={10} inputProps={{ type: "tel" }} />
                <InputControl name="password" label="Password" control={control} mt={10} inputProps={{ type: (show ? 'text' : 'password') }}
                    rightElement={
                        <InputRightElement px={10}
                            children={
                                <IconButton aria-label="show/hide" h='1.75rem' size='sm' onClick={handleClick} bg={"white"} mr={5} px={10}
                                    icon={show ? <ViewOffIcon color={"gray"} /> : <ViewIcon color={"gray"} />
                                    }
                                />
                            }
                        />
                    }
                />

                <Flex mt={10}>
                    <Button type={"submit"} mx={"auto"} bg={"green.400"} color={"white"} _hover={{ color: "black" }}>Login</Button>
                </Flex>
            </Form>
        </Box>
    )
}