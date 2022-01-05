import { auth } from 'firebase.config'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useSignIn = () => {
	const signIn = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password)
		} catch (error) {
			throw error
		}
	}

	return signIn
}
