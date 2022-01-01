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
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
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

	const onSubmit = (data: LoginSchema) => {
		console.log(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid gap='3'>
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
				<Flex w='100%' justifyContent={'flex-end'}>
					<Button ml='auto' type='submit'>
						Login
					</Button>
				</Flex>
			</Grid>
		</form>
	)
}

export default Login
