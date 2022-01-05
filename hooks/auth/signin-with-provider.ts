import { createUser } from 'db/users/create-user'
import { auth, db, googleProvider } from 'firebase.config'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'

type AuthProvider = 'google'

const providers = {
	google: googleProvider,
}

export const providerInstance = {
	google: GoogleAuthProvider,
}

export const useSignInWithProvider = (providerName: AuthProvider) => {
	const provider = providers[providerName]
	const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('idle')

	const signIn = async () => {
		setStatus('idle')
		try {
			setStatus('loading')
			const { user } = await signInWithPopup(auth, provider)
			const isNewUser =
				user.metadata.creationTime === user.metadata.lastSignInTime
			if (isNewUser) {
				await createUser(user.uid, {
					username: user.displayName!,
					photoURL: user.photoURL!,
					email: user.email!,
				})
			}
		} catch (error) {
			setStatus('error')
			throw error
		}
	}

	return { status, signIn }
}
