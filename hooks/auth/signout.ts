import { auth } from 'firebase.config'
import { signOut as FBSignOut } from 'firebase/auth'

export const useSignOut = () => {
	const signOut = async () => {
		try {
			await FBSignOut(auth)
		} catch (error) {
			throw error
		}
	}
	return signOut
}
