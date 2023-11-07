import { Button, Flex, FormControl, Heading } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useOutletContext, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { useForm } from "react-hook-form";
import { InputControl, NumberInputControl, SelectControl, TextareaControl } from "react-hook-form-chakra";
import * as Yup from "yup";
import { getShipmentId } from "~/utils/utils";


export const action = async ({ request, }: ActionFunctionArgs) => {
    const body = await request.formData();

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const user = body.get("user") as string
    const receiver = body.get("receiver") as string
    const description = body.get("description") as string
    const method = body.get("method") as string
    const destination = body.get("destination") as string

    const shipment = getShipmentId()

    const { data: lastCargo } = await supabase.from("cargo").select().match({ shipment: shipment, destination: destination, method: method }).order('id', { ascending: false }).limit(1)

    //@ts-ignore
    const id = lastCargo && lastCargo.length > 0 ? lastCargo!.at(0).id + 1 : 1

    const { error } = await supabase.from("cargo").insert({ id: id, shipment: shipment, destination: destination, method: method, description: description, sender: user, receiver: receiver })

    if (error) {
        console.log(error);
    }

    //await new Promise(r => setTimeout(r, 5000));
    return redirect("/")
}

export default function AddPackages() {
    const { user, shipment, cargo } = useOutletContext<any>()

    const defaultValues = {
        destination: "",
        method: "",
        description: "",
        receiver: "",
    }

    const validationSchema = Yup.object({
        destination: Yup.string().required("Destination is required"),
        method: Yup.string().required("Method is required"),
        description: Yup.string().required("Description of items is required"),
        receiver: Yup.string(),
    })

    const { handleSubmit, control } = useForm({ resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur" });

    const submit = useSubmit()

    return (
        <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, user: user.id },
            {
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
                <SelectControl
                    name="method"
                    label="Method"
                    selectProps={{ placeholder: "Select option" }}
                    control={control}
                    mb={5}
                >
                    <option value="AIR">AIR ✈️</option>
                    <option value="SEA">Sea 🚢</option>
                </SelectControl>
                <TextareaControl mb={5} name="description" label="Description of Items" control={control} />
                <Heading mx={"auto"} mb={5} fontSize={"2xl"}>Receiver Details</Heading>
                <InputControl name="receiver" label="Receiver Email" helperText="We will notify you by default if left empty" control={control}></InputControl>
                <Flex>
                    <Button mt={5} mx={"auto"} type="submit">Submit</Button>
                </Flex>
            </FormControl>
        </Form>
    )
}