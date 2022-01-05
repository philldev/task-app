import { FirebaseError } from 'firebase/app'
import { AuthErrorCodes } from 'firebase/auth'

const getAuthErrorMessage = (error: FirebaseError) => {
	switch (error.code) {
		case AuthErrorCodes.EMAIL_EXISTS:
			return 'Email already exists.'
		case AuthErrorCodes.INVALID_PASSWORD:
		case AuthErrorCodes.USER_DELETED:
			return 'Wrong email or password'
		default:
			return 'Something went wrong. Please try again!'
	}
}

export { getAuthErrorMessage }
