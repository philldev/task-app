import { chakra } from '@chakra-ui/react'

export const Spinner = chakra(({ className, ...props }) => {
	return (
		<svg
			className={[className, 'spinner'].join(' ')}
			viewBox='0 0 50 50'
			fill='current'
			stroke='current'
			{...props}
		>
			<circle
				className='path'
				cx='25'
				cy='25'
				r='20'
				stroke={'black'}
				fill='none'
				strokeWidth='5'
			></circle>
		</svg>
	)
})
