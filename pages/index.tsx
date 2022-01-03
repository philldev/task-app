import {
	Avatar,
	Box,
	Button,
	chakra,
	Checkbox,
	Flex,
	Input,
	StackDivider,
	Text,
	VStack,
} from '@chakra-ui/react'
import { FC } from 'react'

const Home = () => {
	return (
		<Flex flexDir='column' w='100vw' h='100vh'>
			<Box h='16' borderBottom='1px solid' borderColor='gray.100'>
				<Flex
					px='4'
					w='full'
					h='full'
					alignItems='center'
					justifyContent='space-between'
				>
					<Text fontWeight='bold'>Task App</Text>
					<Avatar size='sm' name='Deddy Wolley' />
				</Flex>
			</Box>
			<Flex fontSize='sm' p='4' flex='1' gap='4'>
				<AppBox flex='1' p='4'>
					<Flex justifyContent='space-between' mb='4'>
						<Text fontWeight='bold'>Task List</Text>
						<Button size='xs' justifyContent='flex-start'>
							+ List
						</Button>
					</Flex>
					<VStack
						alignItems='stretch'
						// divider={<StackDivider borderColor='gray.200' />}
					>
						<TaskListItem active>Lorem, ipsum.</TaskListItem>
						<TaskListItem>Lorem, ipsum.</TaskListItem>
						<TaskListItem>Lorem, ipsum.</TaskListItem>
						<TaskListItem>Lorem, ipsum.</TaskListItem>
						<TaskListItem>Lorem, ipsum.</TaskListItem>
					</VStack>
				</AppBox>
				<AppBox p='4' flex='2'>
					<Flex justifyContent='space-between' mb='4'>
						<Text fontWeight='bold'>Lorem, ipsum.</Text>
						<Button size='xs' justifyContent='flex-start'>
							+ Task
						</Button>
					</Flex>
					<VStack spacing='0' alignItems='stretch'>
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
						<TaskItem label='Todo for today' />
					</VStack>
				</AppBox>
			</Flex>
		</Flex>
	)
}

const AppBox = chakra((props) => {
	return (
		<Box
			rounded='md'
			border='1px solid'
			borderColor='gray.100'
			shadow='sm'
			{...props}
		></Box>
	)
})

const TaskItem = (props: { label: string; completed?: boolean }) => {
	return (
		<Flex rounded='md' pos='relative' alignItems='center'>
			<Checkbox mr='4' pos='absolute' left='2' zIndex={10} />
			<Input
				defaultValue={props.label}
				bg='transparent'
				border='transparent'
				fontSize='xs'
				pl='8'
				_focus={{ borderColor: 'gray.300' }}
			/>
		</Flex>
	)
}

const TaskListItem: FC<{ active?: boolean }> = (props) => {
	return (
		<Box
			cursor='pointer'
			rounded='md'
			p='2'
			bg={props.active ? 'black' : 'gray.50'}
			color={props.active ? 'white' : undefined}
			_hover={{ bg: 'gray.100' }}
		>
			{props.children}
		</Box>
	)
}

export default Home
