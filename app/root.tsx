// root.tsx
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ChakraProvider, Flex, Text, extendTheme, useDisclosure } from '@chakra-ui/react';
import { withEmotionCache } from '@emotion/react';
import { LinksFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'; // Depends on the runtime you choose
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
  useRouteError,
} from '@remix-run/react';
import { createBrowserClient, createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from 'database.types';
import React, { useContext, useEffect, useState } from 'react';
import Footer from './components/footer';
import Navbar from './components/navbar';
import { ClientStyleContext, ServerStyleContext } from './context';
import { groupBy } from './utils/utils';


export const meta: MetaFunction = () => {
  return [
    { title: "SMTN International" },
    {
      property: "og:title",
      content: "Official Web App",
    },
    {
      name: "description",
      content: "Naija Naija",
    },
  ];
};

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    },
  ]
}

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  smtn: "#4299E1",
}


const theme = extendTheme({
  colors: colors,
  styles: {
    global: () => ({
      body: {
        bg: "#4299E1",
        color: "white",
      }
    })
  },
})

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Text>Oh ya something went wrong o. Please pray for God to fix this issue.</Text>
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

  const response = new Response()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    request,
    response,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: users } = session ? await supabase.from("users").select() : { data: null }
  const { data: shipments } = session ? await supabase.from("shipments").select().order('id', { ascending: false }) : { data: null }
  const { data: cargo } = session ? await supabase.from("cargo").select().order('shipment', { ascending: false }) : { data: null }
  const { data: boxes } = session ? await supabase.from("boxes").select().order('shipment', { ascending: false }) : { data: null }


  return json(
    {
      env,
      session,
      users,
      shipments,
      cargo,
      boxes
    },
    {
      headers: response.headers,
    }
  )
}

export default function App() {
  const { env, session, users, shipments, cargo, boxes } = useLoaderData<typeof loader>()

  const { revalidate } = useRevalidator()

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  )

  //Auto Refresh Access Token
  const serverAccessToken = session?.access_token

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, supabase, revalidate])

  //data sorting
  const user = session && users?.includes(session.user.id) ? users?.find(user => user.id == session.user.id) : null //equals undefined if user not defined yet

  //alert dialog
  const cancelRef = React.useRef(null)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: session && !user ? true : false })


  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Flex m={"1vh"} h={"97vh"} wrap={"wrap"}>
          <Navbar supabase={supabase} session={session} users={users} />
          <Box my={"auto"} mx={"auto"}>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={() => { }}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader color={"smtn"} fontSize={"lg"} fontWeight={"bold"}>
                    Set up details
                  </AlertDialogHeader>
                  <AlertDialogBody color={"smtn"}>
                    We noticed you haven't set up account information.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Link to={"/account"}>
                      <Button colorScheme={"green"} onClick={onClose}>
                        Enter account information
                      </Button>
                    </Link>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
            <Outlet context={{ session, user, users, shipments, cargo, boxes }} />
          </Box>
          <Footer />
        </Flex>
      </ChakraProvider>
    </Document>
  )
}