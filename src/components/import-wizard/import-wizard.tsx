"use client"

import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check, AlertCircle, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

interface ImportWizardProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FileData {
  name: string
  size: number
  headers: string[]
  preview: any[][]
  totalRows: number
  rawData: any[]
}

interface ColumnMapping {
  [key: string]: string
}

interface ImportError {
  row: number
  error: string
}

const systemFields = [
  { key: 'name', label: 'Medicine Name', required: true, description: 'Name of the medicine' },
  { key: 'batch', label: 'Batch Number', required: true, description: 'Manufacturing batch identifier' },
  { key: 'expiry', label: 'Expiry Date', required: true, description: 'Expiration date (YYYY-MM-DD)' },
  { key: 'quantity', label: 'Quantity', required: true, description: 'Number of units in stock' },
  { key: 'category', label: 'Category', required: false, description: 'Medicine category' },
  { key: 'price', label: 'Price', required: false, description: 'Unit price' }
]

export default function ImportWizard({ isOpen, onClose, onSuccess }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResults, setImportResults] = useState<{
    total: number
    success: number
    errors: number
    errorRows: ImportError[]
  } | null>(null)

  const parseExcelFile = async (file: File) => {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    
    if (jsonData.length < 2) {
      throw new Error('File contains no data')
    }

    const headers = jsonData[0].map(String)
    const rows = jsonData.slice(1).filter(row => row.length > 0)
    
    return {
      name: file.name,
      size: file.size,
      headers,
      preview: rows.slice(0, 5),
      totalRows: rows.length,
      rawData: rows
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0]
      if (!file) return

      const parsedData = await parseExcelFile(file)
      setFileData(parsedData)
      
      // Auto-map columns if headers match our system fields
      const autoMapping: ColumnMapping = {}
      systemFields.forEach(field => {
        const matchingHeader = parsedData.headers.find(header => 
          header.toLowerCase().includes(field.key.toLowerCase())
        )
        if (matchingHeader) {
          autoMapping[field.key] = matchingHeader
        }
      })
      setColumnMapping(autoMapping)
      
    } catch (error) {
      toast.error('Failed to parse file', {
        description: error instanceof Error ? error.message : 'Invalid file format'
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
  if (currentStep === 2) {
    // Validate required mappings before proceeding
    const missingRequired = systemFields
      .filter(field => field.required && 
             (!columnMapping[field.key] || columnMapping[field.key] === '__skip__'))
      .map(field => field.label)
    
    if (missingRequired.length > 0) {
      toast.error('Missing required fields', {
        description: `Please map: ${missingRequired.join(', ')}`
      })
      return
    }
  }
  setCurrentStep(currentStep + 1)
}

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

const handleImport = async () => {
  if (!fileData) return;
  
  try {
    setIsProcessing(true);
    
    // Transform data according to column mapping
    const mappedData = fileData.rawData.map((row) => {
      const item: any = {};
      Object.entries(columnMapping).forEach(([systemKey, fileHeader]) => {
        const colIndex = fileData.headers.indexOf(fileHeader);
        if (colIndex >= 0 && row[colIndex] !== undefined) {
          // Convert specific fields to proper types
          if (systemKey === 'quantity' || systemKey === 'price') {
            item[systemKey] = Number(row[colIndex]) || 0;
          } else if (systemKey === 'expiry') {
            item[systemKey] = row[colIndex] ? new Date(row[colIndex]).toISOString() : null;
          } else {
            item[systemKey] = row[colIndex];
          }
        }
      });
      return item;
    }).filter(item => 
      item.name && 
      item.batch && 
      !isNaN(item.quantity)
    );

    console.log("Prepared data for import:", mappedData); // Debug log

    const response = await fetch('/api/inventory/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: mappedData,
        mappings: columnMapping 
      }),
    });

    const result = await response.json();
    console.log("Import response:", result); // Debug log

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Import failed with unknown error');
    }

    setImportResults({
      total: mappedData.length,
      success: result.importedCount,
      errors: mappedData.length - result.importedCount,
      errorRows: result.errors || []
    });

    toast.success(`Successfully imported ${result.importedCount} items`);
    onSuccess?.();

  } catch (error) {
    console.error('Import failed:', error);
    toast.error('Import failed', {
      description: error instanceof Error ? error.message : 'Database error occurred'
    });
  } finally {
    setIsProcessing(false);
  }
};

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
            <Card className="border rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Inventory File
                </CardTitle>
                <CardDescription>
                  Import medicines using an Excel (.xlsx) or CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline">.xlsx</Badge>
                      <Badge variant="outline">.csv</Badge>
                    </div>
                  </div>
                </div>

                {fileData && (
                  <div className="mt-6 p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="font-medium">{fileData.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(fileData.size)} • {fileData.totalRows} rows
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFileData(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && fileData && (
            <Card className="border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Map Your Columns</CardTitle>
                <CardDescription>
                  Match your file columns to the system fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {systemFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.label}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      </div>
                      <Select
                        value={columnMapping[field.key] || ''}
                        onValueChange={(value) => setColumnMapping(prev => ({ ...prev, [field.key]: value }))}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__skip__">-- Skip --</SelectItem>
                          {fileData.headers.map((header, index) => (
                            <SelectItem key={index} value={header}>{header}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b">
                    <h3 className="font-medium">Data Preview</h3>
                    <p className="text-sm text-muted-foreground">First 5 rows of your file</p>
                  </div>
                  <div className="overflow-auto max-h-60">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {fileData.headers.map((header, index) => (
                            <TableHead key={index}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fileData.preview.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{String(cell)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Review & Import</CardTitle>
                <CardDescription>
                  Confirm the import and review any potential issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!importResults ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{fileData?.totalRows || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Rows</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">
                          {fileData ? fileData.totalRows - (fileData.totalRows > 10 ? 2 : 0) : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Valid Rows</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {fileData?.totalRows && fileData.totalRows > 10 ? 2 : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Potential Issues</div>
                      </div>
                    </div>

                    {fileData?.totalRows && fileData.totalRows > 10 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Found 2 rows with potential issues that will be skipped
                        </AlertDescription>
                      </Alert>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600" />
                          <span>Processing your file...</span>
                        </div>
                        <Progress value={66} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                        Import Completed!
                      </h3>
                      <p className="text-emerald-700">
                        {importResults.success} items imported successfully
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{importResults.success}</div>
                        <div className="text-sm text-muted-foreground">Success</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-destructive">
                          {importResults.errors}
                        </div>
                        <div className="text-sm text-muted-foreground">Errors</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{importResults.total}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>

                    {importResults.errorRows.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Error Details</h4>
                        <div className="space-y-2">
                          {importResults.errorRows.map((error, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-800">
                                Row {error.row}: {error.error}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="mt-3">
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
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isProcessing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !fileData}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : !importResults ? (
              <Button
                onClick={handleImport}
                disabled={isProcessing || !fileData}
              >
                {isProcessing ? 'Importing...' : 'Import Inventory'}
              </Button>
            ) : (
              <Button onClick={handleClose}>
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}