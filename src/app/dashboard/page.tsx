"use client"

import { TrendingUp, AlertTriangle, Calendar, DollarSign, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface DashboardData {
  todaySales: number
  yesterdaySales: number
  lowStockItems: number
  expiringSoonItems: number
  activeUsers: number
  weeklySales: Array<{ name: string; sales: number }>
  stockDistribution: Array<{ name: string; value: number; color: string }>
  topDrugs: Array<{ name: string; quantity: string; trend: string }>
  stockAlerts: Array<{ name: string; status: string; level: string; type: 'warning' | 'danger' }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 flex items-center justify-center">
            <div>Loading dashboard data...</div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-red-500">Error: {error}</div>
          </main>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  // Calculate sales percentage change
  const salesChange = dashboardData.yesterdaySales > 0 
    ? ((dashboardData.todaySales - dashboardData.yesterdaySales) / dashboardData.yesterdaySales) * 100
    : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Sales Card */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{`Today's Sales`}</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">MWK {dashboardData.todaySales.toLocaleString()}</div>
                <p className="text-xs opacity-90">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {salesChange > 0 ? '+' : ''}{salesChange.toFixed(1)}% from yesterday
                </p>
              </CardContent>
            </Card>

            {/* Low Stock Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.lowStockItems}</div>
                <p className="text-xs opacity-90">
                  Items need restocking
                </p>
              </CardContent>
            </Card>

            {/* Expiring Soon Card */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Calendar className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.expiringSoonItems}</div>
                <p className="text-xs opacity-90">
                  Items expire within 30 days
                </p>
              </CardContent>
            </Card>

            {/* Active Users Card */}
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.activeUsers}</div>
                <p className="text-xs opacity-90">
                  Staff members online
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales</CardTitle>
                <CardDescription>Sales performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.weeklySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stock Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Distribution</CardTitle>
                <CardDescription>Current inventory by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.stockDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {dashboardData.stockDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Drugs */}
            <Card>
              <CardHeader>
                <CardTitle>Most Dispensed Drugs</CardTitle>
                <CardDescription>Top selling medications this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topDrugs.map((drug, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{drug.name}</p>
                        <p className="text-sm text-gray-500">{drug.quantity}</p>
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {drug.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.stockAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'danger' ? 'bg-red-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{alert.name}</p>
                          <p className="text-sm text-gray-500">{alert.level}</p>
                        </div>
                      </div>
                      <Badge variant={alert.type === 'danger' ? 'destructive' : 'secondary'}>
                        {alert.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}