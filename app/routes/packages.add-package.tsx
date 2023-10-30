import { Box, Button, Flex, FormControl, Heading, NumberInputField, Radio, Text, useRadioGroup } from "@chakra-ui/react";
import { Form, useOutlet, useOutletContext, useSubmit } from "@remix-run/react";
import { useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
import { InputControl, NumberInputControl, RadioGroupControl, SelectControl, TextareaControl } from "react-hook-form-chakra";
import { useEffect, useState } from "react";
import { SupabaseClient, User, createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { ActionFunctionArgs, redirect } from "@remix-run/node";


export const action = async ({ request, }: ActionFunctionArgs) => {
    const body = await request.formData();

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const userId = body.get("id") as string
    const receiver = body.get("receiver") as string
    const description = body.get("description") as string
    const destination = body.get("destination") as string

    //gets the next Friday
    const d = new Date();
    d.setDate(d.getDate() + (((1 + 11 - d.getDay()) % 7) || 7));

    const shipment_id = ((d.getFullYear() % 100) * 10000) + ((d.getMonth() + 1) * 100) + d.getDate()

    let packages = [{}] as Array<any>
    packages = packages.flatMap( _ => Array(parseInt(body.get("numberOfPackages") as string)).fill({ shipment_id: shipment_id, sender_id: userId, reciever_email: receiver, description: description, destination: destination, paid: 0, status: 0, }))
    
    const { error } = await supabase.from("packages").insert(packages)   
    
    if (error) {
        console.log(error);
    }
    
    //await new Promise(r => setTimeout(r, 5000));
    return redirect("/")
}

export default function AddPackages() {
    const { supabase, session } = useOutletContext<any>()

    const defaultValues = {
        destination: "",
        numberOfPackages: 0,
        description: "",
        receiver: session?.user.email as string,
    }

    const validationSchema = Yup.object({
        destination: Yup.string().required("Destination is required"),
        numberOfPackages: Yup.number().min(1, "At least 1 package is needed"),
        description: Yup.string().required("Description of items is required"),
        receiver: Yup.string().required(),
    })

    const { handleSubmit, control } = useForm({ resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur" });

    const submit = useSubmit()

    return (
        <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, ...session.user }, {
            action: "",
            method: "post",
        }))}>
            <Heading mx={"auto"} mb={5} width={"-webkit-fit-content"}>Add Packages</Heading>
            <FormControl>
                <Heading mx={"auto"} mb={5} fontSize={"2xl"}>Package Details</Heading>
                <SelectControl
                    name="destination"
                    label="Destination"
                    selectProps={{ placeholder: "Select option" }}
                    control={control}
                    mb={5}
                >
                    <option value="NG">Nigeria 🇳🇬</option>
                    <option value="CA">Canada 🇨🇦</option>
                </SelectControl>
                <NumberInputControl mb={5} name="numberOfPackages" label="Number of Packages" control={control} />
                <TextareaControl mb={5} name="description" label="Description of Items" control={control} />
                <Heading mx={"auto"} mb={5} fontSize={"2xl"}>Reciever Details</Heading>
                <InputControl name="receiver" control={control}></InputControl>
                <Flex>
                    <Button mt={5} mx={"auto"} type="submit">Submit</Button>
                </Flex>
            </FormControl>
        </Form>
    )
}