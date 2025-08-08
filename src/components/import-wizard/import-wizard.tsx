"use client"

import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check, AlertCircle, Download, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { useDropzone } from 'react-dropzone'

interface ImportWizardProps {
  isOpen: boolean
  onClose: () => void
}

interface FileData {
  name: string
  size: number
  headers: string[]
  preview: string[][]
  totalRows: number
}

interface ColumnMapping {
  [key: string]: string
}

const systemFields = [
  { key: 'drugName', label: 'Drug Name', required: true, description: 'Name of the medicine' },
  { key: 'batchNumber', label: 'Batch Number', required: true, description: 'Manufacturing batch identifier' },
  { key: 'expiryDate', label: 'Expiry Date', required: true, description: 'Expiration date (DD/MM/YYYY)' },
  { key: 'quantity', label: 'Quantity', required: true, description: 'Number of units in stock' },
  { key: 'unit', label: 'Unit', required: false, description: 'Unit type (tablets, capsules, ml)' },
  { key: 'category', label: 'Category', required: false, description: 'Medicine category' },
  { key: 'supplier', label: 'Supplier', required: false, description: 'Supplier name' },
  { key: 'price', label: 'Price', required: false, description: 'Unit price in MWK' }
]

export default function ImportWizard({ isOpen, onClose }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [isProcessing, setIsProcessing] = useState(false)
  interface ImportErrorRow {
    row: number
    error: string
  }

  const [importResults, setImportResults] = useState<{
    total: number
    success: number
    errors: number
    errorRows: ImportErrorRow[]
  } | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Simulate file parsing
      const mockHeaders = ['Medicine Name', 'Batch No', 'Exp Date', 'Qty', 'Unit Type', 'Category', 'Supplier', 'Cost']
      const mockPreview = [
        ['Paracetamol 500mg', 'PAR001', '15/12/2024', '245', 'Tablets', 'Pain Relief', 'PharmaCorp Ltd', '150'],
        ['Amoxicillin 250mg', 'AMX002', '20/03/2024', '89', 'Capsules', 'Antibiotics', 'MedSupply Co', '450'],
        ['Vitamin C 1000mg', 'VIT004', '30/06/2025', '134', 'Tablets', 'Vitamins', 'VitaHealth Ltd', '300'],
        ['Ibuprofen 400mg', 'IBU003', '10/08/2024', '156', 'Tablets', 'Pain Relief', 'PharmaCorp Ltd', '200'],
        ['Insulin Glargine', 'INS005', '15/01/2024', '15', 'Vials', 'Diabetes', 'DiabetesCare Inc', '2500']
      ]
      
      setFileData({
        name: file.name,
        size: file.size,
        headers: mockHeaders,
        preview: mockPreview,
        totalRows: 156
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImport = async () => {
    setIsProcessing(true)
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setImportResults({
      total: 156,
      success: 152,
      errors: 4,
      errorRows: [
        { row: 23, error: 'Invalid expiry date format' },
        { row: 45, error: 'Missing batch number' },
        { row: 78, error: 'Quantity must be a number' },
        { row: 134, error: 'Drug name is required' }
      ]
    })
    
    setIsProcessing(false)
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setFileData(null)
    setColumnMapping({})
    setImportResults(null)
    setIsProcessing(false)
  }

  const handleClose = () => {
    resetWizard()
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold text-emerald-700">
            <FileSpreadsheet className="mr-3 h-6 w-6" />
            Import Inventory Data
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Import medicines from Excel or CSV files with our guided wizard
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                ${currentStep >= step 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-slate-200 text-slate-500'
                }
              `}>
                {currentStep > step ? <Check className="h-5 w-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`
                  w-16 h-1 mx-2 rounded-full
                  ${currentStep > step ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-700">
                  <Upload className="mr-2 h-5 w-5" />
                  📤 Upload Inventory File
                </CardTitle>
                <CardDescription>
                 { `Import medicines using an Excel (.xlsx) or CSV file. We'll guide you through matching your columns.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!fileData ? (
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
                      ${isDragActive 
                        ? 'border-emerald-400 bg-emerald-50' 
                        : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50'
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                        <Upload className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-700">
                          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                        </p>
                        <p className="text-slate-500 mt-2">or click to browse</p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          .xlsx
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          .csv
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <FileSpreadsheet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{fileData.name}</p>
                          <p className="text-sm text-slate-600">{formatFileSize(fileData.size)} • {fileData.totalRows} rows</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFileData(null)}
                        className="text-slate-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* File Preview */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">File Preview</h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50">
                                {fileData.headers.map((header, index) => (
                                  <TableHead key={index} className="font-semibold text-slate-700">
                                    {header}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fileData.preview.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex} className="text-sm">
                                      {cell}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Showing first 5 rows of {fileData.totalRows} total rows
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && fileData && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-blue-700">
                  🔗 Map Your Columns
                </CardTitle>
                <CardDescription>
                  Match the columns in your file to the fields we use in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {systemFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <label className="font-medium text-slate-800">{field.label}</label>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{field.description}</p>
                      </div>
                      <div className="w-64">
                        <Select
                          value={columnMapping[field.key] || ''}
                          onValueChange={(value) => setColumnMapping(prev => ({ ...prev, [field.key]: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Skip this field --</SelectItem>
                            {fileData.headers.map((header, index) => (
                              <SelectItem key={index} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mapping Preview */}
                {Object.keys(columnMapping).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Mapping Preview</h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              {systemFields
                                .filter(field => columnMapping[field.key])
                                .map((field) => (
                                  <TableHead key={field.key} className="font-semibold text-slate-700">
                                    {field.label}
                                  </TableHead>
                                ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {fileData.preview.slice(0, 3).map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {systemFields
                                  .filter(field => columnMapping[field.key])
                                  .map((field) => {
                                    const columnIndex = fileData.headers.indexOf(columnMapping[field.key])
                                    return (
                                      <TableCell key={field.key} className="text-sm">
                                        {row[columnIndex] || '-'}
                                      </TableCell>
                                    )
                                  })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-green-700">
                  ✅ Review & Import
                </CardTitle>
                <CardDescription>
                  Review the data and confirm to import into inventory.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!importResults ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{fileData?.totalRows || 0}</div>
                        <div className="text-sm text-blue-600">Total Rows Detected</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{(fileData?.totalRows || 0) - 4}</div>
                        <div className="text-sm text-green-600">Ready to Import</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">4</div>
                        <div className="text-sm text-orange-600">Potential Issues</div>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {`We've detected 4 rows with potential issues. These will be skipped during import and can be reviewed later.`}
                      </AlertDescription>
                    </Alert>

                    {isProcessing && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 text-emerald-600">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                            <span className="font-medium">Importing inventory data...</span>
                          </div>
                        </div>
                        <Progress value={66} className="w-full" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Import Completed!</h3>
                      <p className="text-green-700">Your inventory has been successfully updated.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{importResults.success}</div>
                        <div className="text-sm text-green-600">Successfully Imported</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                        <div className="text-2xl font-bold text-red-700">{importResults.errors}</div>
                        <div className="text-sm text-red-600">Errors</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{importResults.total}</div>
                        <div className="text-sm text-blue-600">Total Processed</div>
                      </div>
                    </div>

                    {importResults.errorRows.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Error Details</h4>
                        <div className="space-y-2">
                          {importResults.errorRows.map((error, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                              <span className="text-sm text-red-800">Row {error.row}: {error.error}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="mt-3" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download Error Report
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isProcessing}
            className="button-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="space-x-3">
            <Button variant="outline" onClick={handleClose} className="button-secondary">
              Cancel
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !fileData}
                className="button-primary"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : !importResults ? (
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                className="button-primary"
              >
                {isProcessing ? 'Importing...' : 'Import Inventory'}
              </Button>
            ) : (
              <Button onClick={handleClose} className="button-primary">
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
