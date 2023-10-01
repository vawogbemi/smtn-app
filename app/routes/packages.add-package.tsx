import { Box, Button, Flex, FormControl, Heading, NumberInputField, Radio, Text, useRadioGroup } from "@chakra-ui/react";
import { Form, useOutlet, useOutletContext } from "@remix-run/react";
import { useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
import { InputControl, NumberInputControl, RadioGroupControl, TextareaControl } from "react-hook-form-chakra";
import RadioCard from "~/components/radiogroup";
import { useState } from "react";
import { SupabaseClient, User } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";




export default function AddPackages() {

    const { userEmail } = useOutletContext<{ userEmail: string }>()
    
    const defaultValues = {
        numberOfPackages: 1,
        descriptionOfItems: "",
        receiver:userEmail,
    }
    
    const validationSchema = Yup.object({
        numberOfPackages: Yup.number().min(1, "At least 1 package is needed"),
        descriptionOfItems: Yup.string().required("Description of items is required"),
        receiver: Yup.string().required(),
    })

    const { handleSubmit, control, formState, reset } = useForm({ resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur" });
    const values = useWatch({ control })


    const onSubmit = (data: any) => { console.log(data) }


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Heading mx={"auto"} mb={5} width={"-webkit-fit-content"}>Add Packages</Heading>
            <FormControl>
                <Heading mx={"auto"} mb={5} fontSize={"2xl"}>Package Details</Heading>
                <NumberInputControl mb={5} name="numberOfPackages" label="Number of Packages" control={control} />
                <TextareaControl mb={5} name="descriptionOfItems" label="Description of Items" control={control} />
                <Heading mx={"auto"} mb={5} fontSize={"2xl"}>Reciever Details</Heading>
                <InputControl name="receiver" control={control}></InputControl>
                <Flex>
                    <Button mt={5} mx={"auto"} type="submit">Submit</Button>
                </Flex>
            </FormControl>
        </Form>
    )
}