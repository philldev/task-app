import { db } from 'firebase.config'
import { setDoc, doc } from 'firebase/firestore'

export const createUser = async (
	userId: string,
	data: {
		email: string
		photoURL: string
		username: string
	}
) => {
	try {
		await setDoc(doc(db, 'users', userId), data)
	} catch (error) {
		throw error
	}
}
