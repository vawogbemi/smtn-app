import { ArrowBackIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Input, InputRightElement, createIcon, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { supabase } from "@supabase/auth-ui-shared";
import { Database } from "database.types";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { InputControl, SelectControl } from "react-hook-form-chakra";
import * as Yup from "yup";
import CountryCodeSelector from "./countrycodeselector";


export default function SignUpForm(props: any) {

    const [show, setShow] = useState(false)

    const handleClick = () => setShow(!show)

    const [other, setOther] = useState(false)

    const submit = useSubmit()

    const DefaultValues = {
        name: "",
        email: "",
        address: "",
        country: "",
        city: "",
        postal_zip_code: "",
        country_code: "",
        other: "",
        phone: "",
        password: "",
        token: "",
    }

    const ValidationSchema = Yup.object({
        name: Yup.string().min(3).required("Name is required"),
        email: Yup.string().min(3).required("Email is required"),
        address: Yup.string().min(3).required("Address is required"),
        country: Yup.string().min(3).required("Country is required"),
        city: Yup.string().min(3).required("City is required"),
        postal_zip_code: Yup.string(),
        country_code: Yup.string().required("Country code is required"),
        other: Yup.string(),
        phone: Yup.string().min(3).required("WhatsApp number is required"),
        password: Yup.string().min(3).required("Password"),
        token: Yup.string().min(3).required("One Time Password is required"),
    })

    const { handleSubmit, control, getValues, formState: { errors, dirtyFields } } = useForm({ resolver: yupResolver(ValidationSchema), defaultValues: DefaultValues, mode: "onBlur" })


    //Sign Up States
    const [step, setStep] = useState(1)

    const toast = useToast()

    return (
        <Box w={"90vw"} bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} maxH={"80vh"}>
            <Flex>
                <IconButton aria-label="close" icon={<CloseIcon />} ml={"auto"} bg="white" onClick={() => props.setSignUp(false)}></IconButton>
            </Flex>
            <Form method="post" onSubmit={handleSubmit((data: any) => {
                props.supabase.auth.verifyOtp({
                    phone: other ? `${getValues("other")}${getValues("phone")}` : `${getValues("country_code")}${getValues("phone")}`,
                    token: getValues("token"),
                    type: 'sms',
                }).then(({ data, error }: any) => {
                    console.log(data)
                    console.log(error)
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
                        props.supabase.from("users").insert({ id: data.user.id, name: getValues('name'), country_code: getValues('country_code'), phone: getValues('phone'), email: getValues('email'), address: getValues('address'), country: getValues('country'), city: getValues('city'), postal_zip_code: getValues('postal_zip_code') }).then(({ data, error }: any) => {
                            props.setSignUp(false);
                            submit({ ...data },
                                {
                                    action: "/",
                                    method: "post",
                                })
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
                )
            }

            )}>
                <Flex>
                    <Heading mx={"auto"}>Sign Up</Heading>
                </Flex>
                {
                    step == 1 &&
                    <Box>
                        <InputControl name="name" label={"Name"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <InputControl name="email" label={"Email"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <InputControl name="address" label={"Address"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <InputControl name="country" label={"Country"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <InputControl name="city" label={"City"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <InputControl name="postal_zip_code" label={"Postal/Zip Code"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <Flex mt={10}>
                            <Button mx={"auto"} bg={"green.400"} color={"white"} _hover={{ color: "black" }} onClick={() => {
                                Object.keys(dirtyFields).length > 4 && Object.keys(errors).length == 0 ?
                                    setStep(2) :
                                    toast({
                                        title: 'Something went wrong.',
                                        description: `Fill out form fields`,
                                        status: 'error',
                                        duration: 9000,
                                        isClosable: true,
                                    })
                            }}>
                                Next
                            </Button>
                        </Flex>
                    </Box>
                }
                {
                    step > 1 &&
                    <Box>
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
                    </Box>
                }
                {
                    step == 2 &&
                    <Flex mt={10}>
                        <Box mx={"auto"} >
                            <IconButton aria-label="back" icon={<ArrowBackIcon />} onClick={() => setStep(1)} mr={2.5} />
                            <Button bg={"green.400"} color={"white"} _hover={{ color: "black" }} onClick={() => {
                                props.supabase.auth.signUp({
                                    phone: other ? `${getValues("other")}${getValues("phone")}` : `${getValues("country_code")}${getValues("phone")}`,
                                    password: getValues("password"),
                                }).then(({ error }: any) => {
                                    if (error) {
                                        toast({
                                            title: 'Something went wrong.',
                                            description: `Error: ${error}. Please try again or contact us.`,
                                            status: 'error',
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    } else {
                                        setStep(3)
                                    }
                                }).catch(({ error }: any) =>
                                    toast({
                                        title: 'Something went wrong.',
                                        description: `Error: ${error}. Please try again or contact us.`,
                                        status: 'error',
                                        duration: 9000,
                                        isClosable: true,
                                    })
                                )
                            }}>
                                Continue
                            </Button>
                        </Box>
                    </Flex>
                }
                {
                    step == 3 &&
                    <Box>
                        <InputControl name="token" label={"One Time Password"} borderColor={"blackAlpha.800"} mt={5} control={control}></InputControl>
                        <Flex mt={10}>
                            <Box mx={"auto"} >
                                <IconButton aria-label="back" icon={<ArrowBackIcon />} onClick={() => setStep(2)} mr={2.5} />
                                <Button type="submit" bg={"green.400"} color={"white"} _hover={{ color: "black" }}>
                                    Submit
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                }
            </Form>
        </Box>
    )
}