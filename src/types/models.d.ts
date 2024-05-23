export type Category = {
  id: string
  category_name: string
  category_img: string
  img_name: string
}

export type Genre = {
  id: string
  name: string
  category_id: string
}

export type Store = {
  id: string
  category: string
  genre: string
  visitDate: string
  nameOfStore: string
  address: string
  totalAmount: number
  contents: string
  photos: string
}
