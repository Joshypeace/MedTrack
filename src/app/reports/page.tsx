"use client"

import { useState } from "react"
import { Download, TrendingUp, DollarSign, Package, Users, PieChart, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

const salesData = [
  { month: "Jan", revenue: 45000, items: 1200 },
  { month: "Feb", revenue: 52000, items: 1350 },
  { month: "Mar", revenue: 48000, items: 1180 },
  { month: "Apr", revenue: 61000, items: 1520 },
  { month: "May", revenue: 55000, items: 1400 },
  { month: "Jun", revenue: 67000, items: 1680 },
]

const profitLossData = {
  revenue: {
    totalSales: 328000,
    prescriptionSales: 245000,
    otcSales: 83000,
    consultationFees: 0,
    otherRevenue: 0,
  },
  costOfGoodsSold: {
    medicationCosts: 196800,
    shippingCosts: 8200,
    totalCOGS: 205000,
  },
  operatingExpenses: {
    salaries: 45000,
    rent: 25000,
    utilities: 8500,
    insurance: 3200,
    marketing: 2800,
    maintenance: 1500,
    licenses: 2000,
    other: 3000,
    totalOperatingExpenses: 91000,
  },
  calculations: {
    grossProfit: 123000, // revenue - COGS
    netProfit: 32000, // grossProfit - operatingExpenses
    grossMargin: 37.5, // (grossProfit / revenue) * 100
    netMargin: 9.8, // (netProfit / revenue) * 100
  },
}

const monthlyPLData = [
  {
    month: "Jan",
    revenue: 45000,
    cogs: 28000,
    expenses: 12000,
    grossProfit: 17000,
    netProfit: 5000,
  },
  {
    month: "Feb",
    revenue: 52000,
    cogs: 32000,
    expenses: 13000,
    grossProfit: 20000,
    netProfit: 7000,
  },
  {
    month: "Mar",
    revenue: 48000,
    cogs: 30000,
    expenses: 12500,
    grossProfit: 18000,
    netProfit: 5500,
  },
  {
    month: "Apr",
    revenue: 61000,
    cogs: 38000,
    expenses: 14000,
    grossProfit: 23000,
    netProfit: 9000,
  },
  {
    month: "May",
    revenue: 55000,
    cogs: 34000,
    expenses: 13500,
    grossProfit: 21000,
    netProfit: 7500,
  },
  {
    month: "Jun",
    revenue: 67000,
    cogs: 42000,
    expenses: 15000,
    grossProfit: 25000,
    netProfit: 10000,
  },
]

const expenseBreakdown = [
  { name: "Salaries", value: 45000, color: "#10B981" },
  { name: "Rent", value: 25000, color: "#3B82F6" },
  { name: "Utilities", value: 8500, color: "#F59E0B" },
  { name: "Insurance", value: 3200, color: "#EF4444" },
  { name: "Marketing", value: 2800, color: "#8B5CF6" },
  { name: "Other", value: 6500, color: "#6B7280" },
]

const topSellingItems = [
  { name: "Paracetamol 500mg", quantity: 2450, revenue: 367500 },
  { name: "Amoxicillin 250mg", quantity: 1890, revenue: 850500 },
  { name: "Ibuprofen 400mg", quantity: 1560, revenue: 312000 },
  { name: "Vitamin C 1000mg", quantity: 1340, revenue: 402000 },
  { name: "Aspirin 75mg", quantity: 1200, revenue: 144000 },
]

const staffPerformance = [
  { name: "Dr. Chisomo Mwale", sales: 45, revenue: 125000 },
  { name: "Nurse Jane Phiri", sales: 38, revenue: 98000 },
  { name: "Tech. Peter Banda", sales: 32, revenue: 87000 },
  { name: "Asst. Mary Tembo", sales: 28, revenue: 72000 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-30-days")
  const [reportType, setReportType] = useState("sales")

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-slate-600">Generate detailed reports and analyze pharmacy performance</p>
          </div>

          {/* Report Filters */}
          <Card className="card-enhanced mb-8">
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>Customize your report parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="staff">Staff Performance</SelectItem>
                      <SelectItem value="financial">Financial Summary</SelectItem>
                      <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input type="date" id="start-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input type="date" id="end-date" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="button-primary">Generate Report</Button>
                <Button variant="outline" className="bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Tabs for Different Report Types */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">MK328,000</div>
                    <p className="text-xs text-slate-600">
                      <TrendingUp className="inline h-3 w-3 mr-1 text-emerald-500" />
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <PieChart className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">MK32,000</div>
                    <p className="text-xs text-slate-600">9.8% profit margin</p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                    <Package className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">8,440</div>
                    <p className="text-xs text-slate-600">+8.2% from last month</p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <Users className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">1,247</div>
                    <p className="text-xs text-slate-600">+15.3% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                    <CardDescription>Revenue and items sold over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue (MK)" />
                        <Line type="monotone" dataKey="items" stroke="#3B82F6" strokeWidth={2} name="Items Sold" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Selling Items */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Top Selling Items</CardTitle>
                    <CardDescription>Best performing medications this period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topSellingItems} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#10B981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Comprehensive Profit & Loss Statement Tab */}
            <TabsContent value="profit-loss" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* P&L Summary Cards */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Gross Profit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">MK123,000</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {profitLossData.calculations.grossMargin}% margin
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">Revenue minus cost of goods sold</p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Net Profit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">MK32,000</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {profitLossData.calculations.netMargin}% margin
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">After all expenses</p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Operating Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">MK91,000</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        27.7% of revenue
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">Total operational costs</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed P&L Statement */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Profit & Loss Statement</CardTitle>
                    <CardDescription>Detailed financial breakdown for the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Revenue Section */}
                      <div className="border-b pb-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Revenue</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Prescription Sales</span>
                            <span className="font-medium">
                              MK{profitLossData.revenue.prescriptionSales.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">OTC Sales</span>
                            <span className="font-medium">MK{profitLossData.revenue.otcSales.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-emerald-600 pt-2 border-t">
                            <span>Total Revenue</span>
                            <span>MK{profitLossData.revenue.totalSales.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* COGS Section */}
                      <div className="border-b pb-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Cost of Goods Sold</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Medication Costs</span>
                            <span className="font-medium">
                              MK{profitLossData.costOfGoodsSold.medicationCosts.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Shipping & Handling</span>
                            <span className="font-medium">
                              MK{profitLossData.costOfGoodsSold.shippingCosts.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-red-600 pt-2 border-t">
                            <span>Total COGS</span>
                            <span>MK{profitLossData.costOfGoodsSold.totalCOGS.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Gross Profit */}
                      <div className="border-b pb-4">
                        <div className="flex justify-between font-bold text-emerald-600 text-lg">
                          <span>Gross Profit</span>
                          <span>MK{profitLossData.calculations.grossProfit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Operating Expenses */}
                      <div className="border-b pb-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Operating Expenses</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Salaries & Benefits</span>
                            <span className="font-medium">
                              MK{profitLossData.operatingExpenses.salaries.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Rent</span>
                            <span className="font-medium">
                              MK{profitLossData.operatingExpenses.rent.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Utilities</span>
                            <span className="font-medium">
                              MK{profitLossData.operatingExpenses.utilities.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Insurance</span>
                            <span className="font-medium">
                              MK{profitLossData.operatingExpenses.insurance.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Marketing</span>
                            <span className="font-medium">
                              MK{profitLossData.operatingExpenses.marketing.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Other Expenses</span>
                            <span className="font-medium">
                              MK
                              {(
                                profitLossData.operatingExpenses.maintenance +
                                profitLossData.operatingExpenses.licenses +
                                profitLossData.operatingExpenses.other
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-red-600 pt-2 border-t">
                            <span>Total Operating Expenses</span>
                            <span>MK{profitLossData.operatingExpenses.totalOperatingExpenses.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Net Profit */}
                      <div className="flex justify-between font-bold text-blue-600 text-xl">
                        <span>Net Profit</span>
                        <span>MK{profitLossData.calculations.netProfit.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly P&L Trend and Expense Breakdown */}
                <div className="space-y-6">
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Monthly Profit Trend</CardTitle>
                      <CardDescription>Gross and net profit over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyPLData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="grossProfit"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Gross Profit"
                          />
                          <Line
                            type="monotone"
                            dataKey="netProfit"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Net Profit"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Expense Breakdown</CardTitle>
                      <CardDescription>Operating expenses by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Tooltip />
                          <Legend />
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Items Table */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Detailed Sales Report</CardTitle>
                    <CardDescription>Top performing medications with revenue details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topSellingItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                              <TableCell className="text-right">MK{item.revenue.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Staff Performance */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Staff Performance</CardTitle>
                    <CardDescription>Sales performance by staff member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Staff Member</TableHead>
                            <TableHead className="text-right">Sales</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {staffPerformance.map((staff, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{staff.name}</TableCell>
                              <TableCell className="text-right">{staff.sales}</TableCell>
                              <TableCell className="text-right">MK{staff.revenue.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6"></TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
