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
import { useSignup } from 'hooks/auth/signup'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAuthErrorMessage } from 'utils/auth/get-auth-error-message'
import * as y from 'yup'
import { AuthLayout } from '../components/auth-layout'

const Signup = () => {
	return (
		<AuthLayout title='Create Account'>
			<Head>
				<title>Signup</title>
			</Head>
			<SignupForm />
			<Text fontSize='sm'>
				Already have account?{' '}
				<NextLink href='/login' passHref>
					<Link>Login</Link>
				</NextLink>
			</Text>
		</AuthLayout>
	)
}

const SignupForm = () => {
	const schema = y.object({
		username: y.string().required('username is required'),
		email: y.string().email('invalid email').required('email is Required'),
		password: y
			.string()
			.min(6, 'password must be longer than 6 characters')
			.required('password is Required'),
	})

	type SignupSchema = {
		username: string
		email: string
		password: string
	}

	const signup = useSignup()

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

	const onSubmit = async (data: SignupSchema) => {
		try {
			setState({ status: 'loading', error: null })
			await signup(data.username, data.email, data.password)
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

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<SignupSchema>({
		resolver: yupResolver(schema),
	})

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid gap='3'>
				<Grid gap='2'>
					<FormControl isInvalid={Boolean(errors.username)}>
						<FormLabel htmlFor='name'>Username</FormLabel>
						<Input
							id='username'
							placeholder='enter your username'
							{...register('username')}
						/>
						<FormErrorMessage>
							{errors.username && errors.username.message}
						</FormErrorMessage>
					</FormControl>
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
				<Flex w='100%' justifyContent={'flex-end'}>
					<Button
						loading={state.status === 'loading'}
						w='full'
						colorScheme='telegram'
						mt='5'
						type='submit'
					>
						Signup
					</Button>
				</Flex>
				<Text color='red.500'>{state.error}</Text>
			</Grid>
		</form>
	)
}

export default Signup
