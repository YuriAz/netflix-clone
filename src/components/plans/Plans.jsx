import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  onSnapshot
} from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { selectUser } from '../../userSlice'
import { loadStripe } from '@stripe/stripe-js'
import db from '../../firebase'
import './Plans.css'

export default function Plans() {
  const [products, setProducts] = useState([{}])
  const user = useSelector(selectUser)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, 'customers'))
      const customerSnap = await getDocs(q)

      customerSnap.forEach(async customerDoc => {
        const subsQuery = query(collection(customerDoc.ref, 'subscriptions'))
        const subsSnap = await getDocs(subsQuery)
        subsSnap.forEach(subscription => {
          console.log(subscription)
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start: subscription.data().current_period_start
          })
        })
      })
    }

    fetchData()
  }, [user.uid])

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, 'products'), where('active', '==', true))
      const querySnapshot = await getDocs(q)

      const products = {}

      querySnapshot.forEach(async productDoc => {
        products[productDoc.id] = productDoc.data()

        const priceQuery = query(collection(productDoc.ref, 'prices'))
        const priceSnap = await getDocs(priceQuery)
        priceSnap.forEach(price => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data()
          }
        })
      })

      setProducts(products)
    }

    fetchData()
  }, [])

  console.log(subscription)

  const loadCheckout = async priceId => {
    const docRef = doc(
      db,
      'customers',
      user?.uid,
      'checkout_sessions',
      user?.uid
    )
    setDoc(docRef, {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    })

    onSnapshot(
      doc(db, 'customers', user?.uid, 'checkout_sessions', user?.uid),
      async snap => {
        const { price, success_url, cancel_url } = snap.data()

        const stripe = await loadStripe(
          'pk_test_51NToHVFOU8xUF7aHXw5wGBmVViei8MCn8aOYIs0PuUWvQXhc39YEjUFRjKVGHtF4SH9WBKMO7tqJs2nfkDmYYR1b00XSPtC143'
        )

        stripe.redirectToCheckout({
          lineItems: [{ price: price, quantity: 1 }],
          mode: 'subscription',
          cancelUrl: cancel_url,
          successUrl: success_url
        })
      }
    )
  }

  return (
    <div className="plans">
      {subscription && (
        <p>
          Renewal date:{' '}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role)

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && 'plans__plan--disabled'
            } plans__plan`}
          >
            <div className="plans__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
