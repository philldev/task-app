import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

const theme = extendTheme({
	shadows: { outline: 'none' },
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}

export default MyApp
