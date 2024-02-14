import {userAxiosInstance} from './axiosInstance'


export const productList = async () => {
  const data = await userAxiosInstance.get('/')
  return data
}

export const addToCart = async (productId,quantity) => {
  const data = await userAxiosInstance.put('/addToCart',{productId,quantity})
  return data
}

export const cartProducts = async () => {
  const data = await userAxiosInstance.get('/getCart')
  return data
}

export const updateCart = async (productId,quantity) => {
  const data = await userAxiosInstance.patch('/updateCart',{productId,quantity})
  return data
}
export const deleteCartProdut = async (cartId) => {
  const data = await userAxiosInstance.patch('/deleteProduct',{cartId})
  return data
}