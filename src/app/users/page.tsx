"use client"

import { useState } from 'react'
import { Search, Plus, Edit, Trash2, User, Shield, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

const userData = [
  {
    id: 1,
    name: 'Dr. Chisomo Mwale',
    email: 'chisomo.mwale@medtrack.mw',
    role: 'Pharmacist',
    status: 'Active',
    lastLogin: '2024-01-15 09:30',
    permissions: ['inventory', 'sales', 'prescriptions', 'reports', 'users']
  },
  {
    id: 2,
    name: 'Jane Phiri',
    email: 'jane.phiri@medtrack.mw',
    role: 'Technician',
    status: 'Active',
    lastLogin: '2024-01-15 08:45',
    permissions: ['inventory', 'sales', 'prescriptions']
  },
  {
    id: 3,
    name: 'Peter Banda',
    email: 'peter.banda@medtrack.mw',
    role: 'Cashier',
    status: 'Active',
    lastLogin: '2024-01-14 16:20',
    permissions: ['sales']
  },
  {
    id: 4,
    name: 'Mary Tembo',
    email: 'mary.tembo@medtrack.mw',
    role: 'Assistant',
    status: 'Inactive',
    lastLogin: '2024-01-10 14:15',
    permissions: ['inventory', 'sales']
  },
  {
    id: 5,
    name: 'James Lungu',
    email: 'james.lungu@medtrack.mw',
    role: 'Technician',
    status: 'Active',
    lastLogin: '2024-01-15 07:30',
    permissions: ['inventory', 'sales', 'prescriptions']
  }
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<typeof userData[0] | null>(null)

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Pharmacist':
        return <Badge className="bg-green-100 text-green-800">Pharmacist</Badge>
      case 'Technician':
        return <Badge className="bg-blue-100 text-blue-800">Technician</Badge>
      case 'Cashier':
        return <Badge className="bg-purple-100 text-purple-800">Cashier</Badge>
      case 'Assistant':
        return <Badge className="bg-orange-100 text-orange-800">Assistant</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>
  }

  const filteredData = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage system users and their access permissions</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">4</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pharmacists</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">1</div>
                <p className="text-xs text-muted-foreground">Licensed pharmacists</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                <User className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">3</div>
                <p className="text-xs text-muted-foreground">Currently logged in</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account and assign permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input id="full-name" placeholder="John Banda" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@medtrack.mw" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pharmacist">Pharmacist</SelectItem>
                              <SelectItem value="technician">Technician</SelectItem>
                              <SelectItem value="cashier">Cashier</SelectItem>
                              <SelectItem value="assistant">Assistant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" placeholder="••••••••" />
                        </div>
                      </div>
                      <div className="grid gap-4">
                        <Label>Permissions</Label>
                        <div className="space-y-3">
                          {[
                            { id: 'inventory', label: 'Inventory Management' },
                            { id: 'sales', label: 'Sales & Dispensing' },
                            { id: 'prescriptions', label: 'Prescription Records' },
                            { id: 'reports', label: 'Reports & Analytics' },
                            { id: 'users', label: 'User Management' },
                            { id: 'settings', label: 'System Settings' }
                          ].map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Switch id={permission.id} />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Create User
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
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Edit User Permissions</DialogTitle>
                                  <DialogDescription>
                                    Modify user access and permissions
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label>User Details</Label>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{selectedUser.name}</p>
                                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                        <p className="text-sm text-gray-600">{selectedUser.role}</p>
                                      </div>
                                    </div>
                                    <div className="grid gap-4">
                                      <Label>Current Permissions</Label>
                                      <div className="space-y-3">
                                        {[
                                          { id: 'inventory', label: 'Inventory Management' },
                                          { id: 'sales', label: 'Sales & Dispensing' },
                                          { id: 'prescriptions', label: 'Prescription Records' },
                                          { id: 'reports', label: 'Reports & Analytics' },
                                          { id: 'users', label: 'User Management' },
                                          { id: 'settings', label: 'System Settings' }
                                        ].map((permission) => (
                                          <div key={permission.id} className="flex items-center space-x-2">
                                            <Switch 
                                              id={permission.id} 
                                              checked={selectedUser.permissions.includes(permission.id)}
                                            />
                                            <Label htmlFor={permission.id} className="text-sm">
                                              {permission.label}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">
                                    Cancel
                                  </Button>
                                  <Button className="bg-green-600 hover:bg-green-700">
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
