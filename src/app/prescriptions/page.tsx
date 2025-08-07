"use client"

import { useState } from 'react'
import { Search, Upload, Eye, FileText, User, Calendar, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

const prescriptionData = [
  {
    id: 1,
    patientName: 'John Banda',
    age: 45,
    gender: 'Male',
    doctor: 'Dr. Chisomo Mwale',
    date: '2024-01-15',
    status: 'Pending',
    medications: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
    hasImage: true
  },
  {
    id: 2,
    patientName: 'Mary Phiri',
    age: 32,
    gender: 'Female',
    doctor: 'Dr. James Tembo',
    date: '2024-01-14',
    status: 'Dispensed',
    medications: ['Metformin 500mg', 'Vitamin D3'],
    hasImage: false
  },
  {
    id: 3,
    patientName: 'Peter Mbewe',
    age: 28,
    gender: 'Male',
    doctor: 'Dr. Grace Nyirenda',
    date: '2024-01-14',
    status: 'Pending',
    medications: ['Ibuprofen 400mg'],
    hasImage: true
  },
  {
    id: 4,
    patientName: 'Sarah Kachingwe',
    age: 55,
    gender: 'Female',
    doctor: 'Dr. Michael Lungu',
    date: '2024-01-13',
    status: 'Completed',
    medications: ['Insulin Glargine', 'Metformin 1000mg'],
    hasImage: true
  }
]

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<typeof prescriptionData[0] | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'Dispensed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Dispensed</Badge>
      case 'Completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredData = prescriptionData.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || prescription.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Records</h1>
            <p className="text-gray-600">Manage patient prescriptions and medical records</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <p className="text-xs text-muted-foreground">Awaiting dispensing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
                <User className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">8</div>
                <p className="text-xs text-muted-foreground">Medications dispensed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <FileText className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">136</div>
                <p className="text-xs text-muted-foreground">Fully processed</p>
              </CardContent>
            </Card>
          </div>

          {/* Prescriptions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Prescription Records</CardTitle>
                  <CardDescription>View and manage patient prescriptions</CardDescription>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Add Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Prescription</DialogTitle>
                      <DialogDescription>
                        Enter patient details and upload prescription image.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="patient-name">Patient Name</Label>
                          <Input id="patient-name" placeholder="John Banda" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" placeholder="45" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="doctor">Doctor</Label>
                          <Input id="doctor" placeholder="Dr. Chisomo Mwale" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="medications">Medications</Label>
                        <Textarea
                          id="medications"
                          placeholder="List prescribed medications..."
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="prescription-image">Prescription Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Upload prescription image</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Add Prescription
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by patient name or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Dispensed">Dispensed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.patientName}</TableCell>
                        <TableCell>{prescription.age}</TableCell>
                        <TableCell>{prescription.gender}</TableCell>
                        <TableCell>{prescription.doctor}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {prescription.medications.slice(0, 2).map((med, index) => (
                              <div key={index} className="text-sm">{med}</div>
                            ))}
                            {prescription.medications.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{prescription.medications.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedPrescription(prescription)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Prescription Details</DialogTitle>
                                  <DialogDescription>
                                    View complete prescription information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedPrescription && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Patient Name</Label>
                                        <p className="text-sm text-gray-600">{selectedPrescription.patientName}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Age</Label>
                                        <p className="text-sm text-gray-600">{selectedPrescription.age} years</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Gender</Label>
                                        <p className="text-sm text-gray-600">{selectedPrescription.gender}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Doctor</Label>
                                        <p className="text-sm text-gray-600">{selectedPrescription.doctor}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Prescribed Medications</Label>
                                      <div className="mt-2 space-y-1">
                                        {selectedPrescription.medications.map((med, index) => (
                                          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                            {med}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {selectedPrescription.hasImage && (
                                      <div>
                                        <Label className="text-sm font-medium">Prescription Image</Label>
                                        <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                                          <div className="flex items-center justify-center h-32 text-gray-500">
                                            <FileText className="h-8 w-8 mr-2" />
                                            Prescription image available
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {prescription.status === 'Pending' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Dispense
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
