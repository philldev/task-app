import { db } from 'firebase.config'
import { setDoc, doc } from 'firebase/firestore'
import { AppUser } from './users'

export const createUser = async (userId: string, data: AppUser) => {
	try {
		await setDoc(doc(db, 'users', userId), data)
	} catch (error) {
		throw error
	}
}
