"use client"

import { useState } from 'react'
import { Search, Plus, Minus, ShoppingCart, CreditCard, Smartphone, Receipt } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import Sidebar from '../../components/layout/sidebar'
import Header from '../../components/layout/header'

const availableMedicines = [
  { id: 1, name: 'Paracetamol 500mg', price: 150, stock: 245 },
  { id: 2, name: 'Amoxicillin 250mg', price: 450, stock: 8 },
  { id: 3, name: 'Ibuprofen 400mg', price: 200, stock: 156 },
  { id: 4, name: 'Vitamin C 1000mg', price: 300, stock: 134 },
  { id: 5, name: 'Aspirin 75mg', price: 120, stock: 5 },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  total: number
}

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)

  const addToCart = (medicine: typeof availableMedicines[0]) => {
    const existingItem = cart.find(item => item.id === medicine.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setCart([...cart, {
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        total: medicine.price
      }])
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0)
  }

  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const processTransaction = () => {
    setIsReceiptModalOpen(true)
    // Here you would typically process the payment and update inventory
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales & Dispensing</h1>
            <p className="text-gray-600">Process sales and dispense medications to customers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Medicine Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>Search and add medicines to cart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by medicine name or scan barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => addToCart(medicine)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                          <Badge variant={medicine.stock < 10 ? "destructive" : "secondary"}>
                            {medicine.stock} left
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-green-600">MWK {medicine.price}</p>
                        <Button
                          size="sm"
                          className="w-full mt-2 bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(medicine)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopping Cart */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shopping Cart
                  </CardTitle>
                  <CardDescription>{cart.length} items in cart</CardDescription>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Cart is empty</p>
                      <p className="text-sm">Add medicines to start a sale</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-sm text-gray-500">MWK {item.price} each</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total:</span>
                          <span>MWK {getTotalAmount().toLocaleString()}</span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Method</label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="airtel">
                                <div className="flex items-center">
                                  <Smartphone className="mr-2 h-4 w-4" />
                                  Airtel Money
                                </div>
                              </SelectItem>
                              <SelectItem value="tnm">
                                <div className="flex items-center">
                                  <Smartphone className="mr-2 h-4 w-4" />
                                  TNM Mpamba
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={processTransaction}
                        >
                          <Receipt className="mr-2 h-4 w-4" />
                          Complete Sale
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Receipt Modal */}
          <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Transaction Complete</DialogTitle>
                <DialogDescription>
                  Sale processed successfully. Receipt generated below.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-white p-6 border rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="font-bold">MedTrack Pharmacy</h3>
                    <p className="text-sm text-gray-600">Lilongwe, Malawi</p>
                    <p className="text-sm text-gray-600">Receipt #: RCP-{Date.now()}</p>
                    <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
                  </div>
                  
                  <div className="border-t border-b py-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span>{item.name} x{item.quantity}</span>
                        <span>MWK {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between font-bold mb-2">
                    <span>Total:</span>
                    <span>MWK {getTotalAmount().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Payment Method:</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReceiptModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Print Receipt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
