import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	Input,
	Link,
	Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FirebaseError } from 'firebase/app'
import { useSignIn } from 'hooks/auth/signin'
import { useSignInWithProvider } from 'hooks/auth/signin-with-provider'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAuthErrorMessage } from 'utils/auth/get-auth-error-message'
import * as y from 'yup'
import { AuthLayout } from '../components/auth-layout'

const Login = () => {
	return (
		<AuthLayout title='Login'>
			<LoginForm />
			<Text>
				Dont have account?{' '}
				<NextLink href='/signup' passHref>
					<Link>Signup</Link>
				</NextLink>
			</Text>
		</AuthLayout>
	)
}

const LoginForm = () => {
	const schema = y.object({
		email: y.string().email('invalid email').required('email is Required'),
		password: y
			.string()
			.min(6, 'password must be longer than 6 characters')
			.required('password is Required'),
	})

	type LoginSchema = {
		email: string
		password: string
	}

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: yupResolver(schema),
	})

	const signIn = useSignIn()

	const [state, setState] = useState<
		| {
				status: 'loading'
				error: null
		  }
		| {
				status: 'error'
				error: string
		  }
		| { status: 'idle'; error: null }
		| { status: 'success'; error: null }
	>({ status: 'idle', error: null })

	const router = useRouter()

	const onSubmit = async (data: LoginSchema) => {
		try {
			setState({ status: 'loading', error: null })
			await signIn(data.email, data.password)
			router.replace('/')
		} catch (error) {
			if (error instanceof FirebaseError) {
				const err = getAuthErrorMessage(error)
				setState({ status: 'error', error: err })
			} else {
				setState({ status: 'error', error: 'something went wrong' })
			}
		}
	}

	const { signIn: googleSignIn } = useSignInWithProvider('google')

	return (
		<Grid gap='6'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid gap='2'>
					<FormControl isInvalid={Boolean(errors.email)}>
						<FormLabel htmlFor='name'>Email</FormLabel>
						<Input
							id='email'
							type='email'
							placeholder='enter your email'
							{...register('email')}
						/>
						<FormErrorMessage>
							{errors.email && errors.email.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.password)}>
						<FormLabel htmlFor='name'>Password</FormLabel>
						<Input
							id='password'
							type='password'
							placeholder='enter your password'
							{...register('password')}
						/>
						<FormErrorMessage>
							{errors.password && errors.password.message}
						</FormErrorMessage>
					</FormControl>
				</Grid>
				<Flex w='100%' mt='4' justifyContent={'flex-end'}>
					<Button
						loading={state.status === 'loading'}
						colorScheme='telegram'
						w='full'
						type='submit'
					>
						Login with email
					</Button>
				</Flex>
				<Text color='red.500'>{state.error}</Text>
			</form>
			<Button
				colorScheme='red'
				onClick={async (e) => {
					await googleSignIn()
					router.replace('/')
				}}
			>
				Login with google
			</Button>
		</Grid>
	)
}

export default Login
