import {
	Box,
	ChakraProvider,
	extendTheme,
	useColorMode,
} from '@chakra-ui/react'
import { AuthProvider } from 'context/auth.context'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import 'styles/index.css'

const theme = extendTheme({
	shadows: { outline: 'none' },
})

const ColorMode: FC = (props) => {
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Box
			color={colorMode === 'dark' ? 'white' : 'black'}
			bgColor={colorMode === 'dark' ? 'black' : 'white'}
		>
			{props.children}
		</Box>
	)
}

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<AuthProvider>
				<ColorMode>
					<Component {...pageProps} />
				</ColorMode>
			</AuthProvider>
		</ChakraProvider>
	)
}

export default MyApp
