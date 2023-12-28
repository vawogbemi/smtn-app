import { Box, Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useOutletContext, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { useForm, useWatch } from "react-hook-form";
import { InputControl, NumberInputControl, SelectControl, TextareaControl } from "react-hook-form-chakra";
import * as Yup from "yup";

export const action = async ({ request, }: ActionFunctionArgs) => {
    const body = await request.formData();

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })
    const user = (await supabase.auth.getUser()).data.user
    const { id, email } = user!
    const { avatar_url } = user?.user_metadata!
    const name = body.get("name") as string
    const phone = parseInt(body.get("phone") as string)
    const address = body.get("address") as string
    const city = body.get("city") as string
    const postal_code = body.get("postal_code") as string

    const { error } = await supabase.from("users").upsert({ id: id, name: name, phoner: phone, address: address, city: city, postal_code: postal_code, avatar_url: avatar_url, email: email })   

    if (error) {
        console.log(error);
    }
    
    await new Promise(r => setTimeout(r, 1000));
    return redirect("/")

}

export default function Account() {
    const { session, user, users } = useOutletContext<any>()

    const defaultValues = {
        name: user ? user.name as string : "",
        phone_number: user ? user.phone_number as number : undefined,
        address: user ? user.address as string : "",
        city: user ? user.city as string : "",
        postal_code: user ? user.postal_code as string : "",
    }

    const validationSchema = Yup.object({
        name: Yup.string().required(),
        phone_number: Yup.number(),
        address: Yup.string().required(),
        city: Yup.string().required(),
        postal_code: Yup.string(),
    })

    const { handleSubmit, control, formState, reset } = useForm({ resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur" });
    const values = useWatch({ control })

    const submit = useSubmit()

    return (
        <Box bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} w={"90vw"}>
            <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, ...session.user }, {
                action: "",
                method: "post",
            }))}>
                <Heading mx={"auto"} mb={5} width={"-webkit-fit-content"}>Account</Heading>
                <FormControl>
                    <InputControl name="name" label="Name" control={control} mb={5} />
                    <InputControl name="phone" label="Phone Number" control={control} mb={5} />
                    <InputControl name="address" label="Street Address" control={control} mb={5} />
                    <InputControl name="city" label="City" control={control} mb={5} />
                    <InputControl name="postal_code" label="Postal Code" control={control} mb={5} />
                    <Flex>
                        <Button mt={5} mx={"auto"} type="submit">Update</Button>
                    </Flex>
                </FormControl>
            </Form>
        </Box>
    )
}