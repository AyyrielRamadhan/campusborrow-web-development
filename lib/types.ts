export type BorrowStatus = 'pending' | 'approved' | 'rejected' | 'returned'

export type BorrowHistoryRow = {
  id: string
  itemId: string
  itemName: string | null
  category: string | null
  imageUrl: string | null
  quantity: number
  purpose: string
  startDate: string
  endDate: string
  status: string
  createdAt: Date
}

export type AdminBorrowRow = BorrowHistoryRow & {
  userName: string | null
  userEmail: string | null
}
