"use client"

import { useState, useEffect, useCallback } from "react"
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
  Pie,
} from "recharts"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable";
import autoTableEndPosY from "jspdf-autotable";


interface SalesData {
  month: string
  revenue: number
  items: number
}

interface TopSellingItem {
  name: string
  quantity: number
  revenue: number
}

interface StaffPerformance {
  name: string
  sales: number
  revenue: number
}

interface ProfitLossData {
  revenue: {
    totalSales: number
    prescriptionSales: number
    otcSales: number
  }
  costOfGoodsSold: {
    medicationCosts: number
    totalCOGS: number
  }
  operatingExpenses: {
    totalOperatingExpenses: number
    byCategory: Record<string, number>
  }
  calculations: {
    grossProfit: number
    netProfit: number
    grossMargin: number
    netMargin: number
  }
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-30-days")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([])
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([])
  const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null)
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    netProfit: 0,
    itemsSold: 0,
    transactions: 0,
  })

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Calculate date range
      const now = new Date()
      let start = new Date()
      let end = new Date()

      switch (dateRange) {
        case "today":
          start.setHours(0, 0, 0, 0)
          end.setHours(23, 59, 59, 999)
          break
        case "last-7-days":
          start.setDate(now.getDate() - 7)
          start.setHours(0, 0, 0, 0)
          end.setHours(23, 59, 59, 999)
          break
        case "last-30-days":
          start.setDate(now.getDate() - 30)
          start.setHours(0, 0, 0, 0)
          end.setHours(23, 59, 59, 999)
          break
        case "last-3-months":
          start.setMonth(now.getMonth() - 3)
          start.setHours(0, 0, 0, 0)
          end.setHours(23, 59, 59, 999)
          break
        case "last-year":
          start.setFullYear(now.getFullYear() - 1)
          start.setHours(0, 0, 0, 0)
          end.setHours(23, 59, 59, 999)
          break
        case "custom":
          if (startDate && endDate) {
            start = new Date(startDate)
            end = new Date(endDate)
            start.setHours(0, 0, 0, 0)
            end.setHours(23, 59, 59, 999)
          }
          break
      }

      // Fetch sales report
      const salesResponse = await fetch(
        `/api/reports/sales?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      )
      if (!salesResponse.ok) throw new Error('Failed to fetch sales data')
      const salesData = await salesResponse.json()

      // Fetch profit/loss report
      const plResponse = await fetch(
        `/api/reports/profit-loss?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      )
      if (!plResponse.ok) throw new Error('Failed to fetch profit/loss data')
      const plData = await plResponse.json()

      setSalesData(salesData.salesByMonth || [])
      setTopSellingItems(salesData.topSellingItems || [])
      setStaffPerformance(salesData.staffPerformance || [])
      setProfitLossData(plData)
      setSummaryStats({
        totalRevenue: salesData.totalRevenue || 0,
        netProfit: plData.calculations.netProfit || 0,
        itemsSold: salesData.totalItemsSold || 0,
        transactions: salesData.totalTransactions || 0,
      })

    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, startDate, endDate])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const expenseBreakdown = profitLossData ? Object.entries(profitLossData.operatingExpenses.byCategory).map(([name, value]) => ({
    name,
    value,
    color: getColorForCategory(name)
  })) : []

  function getColorForCategory(category: string): string {
    const colors = {
      SALARIES: "#10B981",
      RENT: "#3B82F6",
      UTILITIES: "#F59E0B",
      INSURANCE: "#EF4444",
      MARKETING: "#8B5CF6",
      MAINTENANCE: "#F97316",
      LICENSES: "#06B6D4",
      OTHER: "#6B7280"
    }
    return colors[category as keyof typeof colors] || "#6B7280"
  }

  const formatCurrency = (amount: number) => {
    return `MK${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const exportToCSV = () => {
    if (!salesData.length) {
      toast.error("No data to export")
      return
    }

    // Create CSV content
    const headers = ["Month", "Revenue", "Items Sold"]
    const csvContent = [
      headers.join(","),
      ...salesData.map(item => `"${item.month}",${item.revenue},${item.items}`)
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success("CSV exported successfully")
  }

  const exportToPDF = () => {
    if (!salesData.length) {
      toast.error("No data to export")
      return
    }

    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text("Sales Report", 14, 22)
      doc.setFontSize(12)
      doc.text(`Date Range: ${dateRange}`, 14, 30)
      
      // Add sales data table
      const tableData = salesData.map(item => [
        item.month,
        `MK${item.revenue.toLocaleString()}`,
        item.items.toString()
      ])
      
      autoTable(doc, {
        head: [['Month', 'Revenue', 'Items Sold']],
        body: tableData,
        startY: 40,
        theme: 'grid'
      })
      
      // Save PDF
      doc.save(`sales-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success("PDF exported successfully")
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error("Failed to generate PDF")
    }
  }

  const exportProfitLossToPDF = () => {
    if (!profitLossData) {
      toast.error("No profit/loss data to export")
      return
    }

    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(20)
      doc.text("Profit & Loss Statement", 14, 22)
      doc.setFontSize(12)
      doc.text(`Date Range: ${dateRange}`, 14, 30)
      
      // Revenue section
      doc.setFontSize(16)
      doc.text("Revenue", 14, 50)
      doc.setFontSize(12)
      
      const revenueData = [
        ["Prescription Sales", `MK${profitLossData.revenue.prescriptionSales.toLocaleString()}`],
        ["OTC Sales", `MK${profitLossData.revenue.otcSales.toLocaleString()}`],
        ["Total Revenue", `MK${profitLossData.revenue.totalSales.toLocaleString()}`]
      ]
      
      autoTable(doc, {
        body: revenueData,
        startY: 55,
        theme: 'grid'
      })

      let y = doc.lastAutoTable.finalY + 20
      
      // COGS section
      doc.setFontSize(16)
      doc.text("Cost of Goods Sold", 14, y)
      doc.setFontSize(12)
      
      const cogsData = [
        ["Medication Costs", `MK${profitLossData.costOfGoodsSold.medicationCosts.toLocaleString()}`],
        ["Total COGS", `MK${profitLossData.costOfGoodsSold.totalCOGS.toLocaleString()}`]
      ]
      
      autoTable(doc, {
        body: cogsData,
        startY: doc.lastAutoTable.finalY + 25,
        theme: 'grid'
      })
      
      // Gross Profit
      doc.setFontSize(16)
      doc.text("Gross Profit", 14, doc.lastAutoTable.finalY + 20)
      doc.setFontSize(12)
      doc.text(`MK${profitLossData.calculations.grossProfit.toLocaleString()} (${profitLossData.calculations.grossMargin.toFixed(1)}% margin)`, 14, doc.lastAutoTable.finalY + 30)
      
      // Expenses section
      doc.setFontSize(16)
      doc.text("Operating Expenses", 14, doc.lastAutoTable.finalY + 40)
      doc.setFontSize(12)
      
      const expenseData = Object.entries(profitLossData.operatingExpenses.byCategory).map(([category, amount]) => [
        category,
        `MK${amount.toLocaleString()}`
      ])
      
      expenseData.push(["Total Operating Expenses", `MK${profitLossData.operatingExpenses.totalOperatingExpenses.toLocaleString()}`])
      
      autoTable(doc, {
        body: expenseData,
        startY: doc.lastAutoTable.finalY + 45,
        theme: 'grid'
      })
      
      // Net Profit
      doc.setFontSize(16)
      doc.text("Net Profit", 14, doc.lastAutoTable.finalY + 20)
      doc.setFontSize(12)
      doc.text(`MK${profitLossData.calculations.netProfit.toLocaleString()} (${profitLossData.calculations.netMargin.toFixed(1)}% margin)`, 14, doc.lastAutoTable.finalY + 30)
      
      // Save PDF
      doc.save(`profit-loss-statement-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success("Profit & Loss PDF exported successfully")
    } catch (error) {
      console.error('Error generating P&L PDF:', error)
      toast.error("Failed to generate Profit & Loss PDF")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading reports...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

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
              <CardDescription>
                Select a date range for your reports. Choose "Custom Range" to specify exact start and end dates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Input 
                    type="date" 
                    id="start-date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={dateRange !== 'custom'}
                    className={dateRange !== 'custom' ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    type="date" 
                    id="end-date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={dateRange !== 'custom'}
                    className={dateRange !== 'custom' ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="generate">&nbsp;</Label>
                  <Button onClick={fetchReports} className="w-full button-primary">
                    Generate Report
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="bg-transparent"
                  onClick={exportToCSV}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent"
                  onClick={exportToPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                {profitLossData && (
                  <Button 
                    variant="outline" 
                    className="bg-transparent"
                    onClick={exportProfitLossToPDF}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    P&L Statement
                  </Button>
                )}
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
                    <div className="text-2xl font-bold text-slate-900">{formatCurrency(summaryStats.totalRevenue)}</div>
                    <p className="text-xs text-slate-600">
                      <TrendingUp className="inline h-3 w-3 mr-1 text-emerald-500" />
                      Total revenue
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <PieChart className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(summaryStats.netProfit)}</div>
                    <p className="text-xs text-slate-600">
                      {profitLossData?.calculations.netMargin.toFixed(1)}% profit margin
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                    <Package className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{summaryStats.itemsSold.toLocaleString()}</div>
                    <p className="text-xs text-slate-600">Total items sold</p>
                  </CardContent>
                </Card>

                <Card className="card-enhanced">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <Users className="h-4 w-4 text-slate-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{summaryStats.transactions.toLocaleString()}</div>
                    <p className="text-xs text-slate-600">Total transactions</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                    <CardDescription>Revenue and items sold over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`MK${value}`, 'Revenue']} />
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
                        <Tooltip formatter={(value) => [value, 'Quantity']} />
                        <Bar dataKey="quantity" fill="#10B981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profit & Loss Tab */}
            <TabsContent value="profit-loss" className="space-y-6">
              {profitLossData && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
                    <Button onClick={exportProfitLossToPDF} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download P&L Statement
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="card-enhanced">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-emerald-600" />
                          Gross Profit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                          {formatCurrency(profitLossData.calculations.grossProfit)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {profitLossData.calculations.grossMargin.toFixed(1)}% margin
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
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatCurrency(profitLossData.calculations.netProfit)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {profitLossData.calculations.netMargin.toFixed(1)}% margin
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
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {formatCurrency(profitLossData.operatingExpenses.totalOperatingExpenses)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {((profitLossData.operatingExpenses.totalOperatingExpenses / profitLossData.revenue.totalSales) * 100).toFixed(1)}% of revenue
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
                                  {formatCurrency(profitLossData.revenue.prescriptionSales)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">OTC Sales</span>
                                <span className="font-medium">{formatCurrency(profitLossData.revenue.otcSales)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-emerald-600 pt-2 border-t">
                                <span>Total Revenue</span>
                                <span>{formatCurrency(profitLossData.revenue.totalSales)}</span>
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
                                  {formatCurrency(profitLossData.costOfGoodsSold.medicationCosts)}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-red-600 pt-2 border-t">
                                <span>Total COGS</span>
                                <span>{formatCurrency(profitLossData.costOfGoodsSold.totalCOGS)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Gross Profit */}
                          <div className="border-b pb-4">
                            <div className="flex justify-between font-bold text-emerald-600 text-lg">
                              <span>Gross Profit</span>
                              <span>{formatCurrency(profitLossData.calculations.grossProfit)}</span>
                            </div>
                          </div>

                          {/* Operating Expenses */}
                          <div className="border-b pb-4">
                            <h4 className="font-semibold text-slate-900 mb-3">Operating Expenses</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(profitLossData.operatingExpenses.byCategory).map(([category, amount]) => (
                                <div key={category} className="flex justify-between">
                                  <span className="text-slate-600">{category}</span>
                                  <span className="font-medium">{formatCurrency(amount)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between font-semibold text-red-600 pt-2 border-t">
                                <span>Total Operating Expenses</span>
                                <span>{formatCurrency(profitLossData.operatingExpenses.totalOperatingExpenses)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Net Profit */}
                          <div className="flex justify-between font-bold text-blue-600 text-xl">
                            <span>Net Profit</span>
                            <span>{formatCurrency(profitLossData.calculations.netProfit)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expense Breakdown Chart */}
                    <Card className="card-enhanced">
                      <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>Operating expenses by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <RechartsPieChart>
                            <Pie
                              data={expenseBreakdown}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              labelLine={false}
                            >
                              {expenseBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => [
                                formatCurrency(value), 
                                'Amount'
                              ]} 
                            />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
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
                          {topSellingItems.length > 0 ? (
                            topSellingItems.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                No sales data available
                              </TableCell>
                            </TableRow>
                          )}
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
                          {staffPerformance.length > 0 ? (
                            staffPerformance.map((staff, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{staff.name}</TableCell>
                                <TableCell className="text-right">{staff.sales}</TableCell>
                                <TableCell className="text-right">{formatCurrency(staff.revenue)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                No staff performance data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators and analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Performance analytics coming soon</p>
                    <p className="text-sm">Additional metrics and insights will be available here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}