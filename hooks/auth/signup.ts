import { createUser } from 'db/users/create-user'
import { auth } from 'firebase.config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const useSignup = () => {
	const signup = async (username: string, email: string, password: string) => {
		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			await createUser(user.uid, {
				username: username,
				photoURL: user.photoURL!,
				email: user.email!,
			})
		} catch (error) {
			throw error
		}
	}
	return signup
}
