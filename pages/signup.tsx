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

const Signup = () => {
	return (
		<AuthLayout title='Create Account'>
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
		email: y.string().email('invalid email').required('email is Required'),
		password: y
			.string()
			.min(6, 'password must be longer than 6 characters')
			.required('password is Required'),
	})

	type SignupSchema = {
		email: string
		password: string
	}

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<SignupSchema>({
		resolver: yupResolver(schema),
	})

	const onSubmit = (data: SignupSchema) => {
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
						Signup
					</Button>
				</Flex>
			</Grid>
		</form>
	)
}

export default Signup
