// src/components/import-wizard/column-mapping.tsx
'use client'

import { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const COLUMN_OPTIONS = [
  { value: 'name', label: 'Medicine Name' },
  { value: 'batch', label: 'Batch Number' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'expiry', label: 'Expiry Date' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'category', label: 'Category' },
  { value: 'ignore', label: 'Ignore Column' }
]

export function ColumnMapping({ sampleData, onComplete }: { sampleData: any[], onComplete: (mapping: Record<string, string>) => void }) {
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [previewRows, setPreviewRows] = useState(5)

  if (!sampleData || sampleData.length === 0) return null

  const columns = Object.keys(sampleData[0])

  const handleMappingChange = (column: string, value: string) => {
    setMapping(prev => ({
      ...prev,
      [column]: value
    }))
  }

  const handleSubmit = () => {
    onComplete(mapping)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Map your columns to our system</h3>
      <p className="text-sm text-gray-500">
        Match the columns from your Excel file to the fields in our inventory system.
      </p>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col}>
                  <Select value={mapping[col] || ''} onValueChange={value => handleMappingChange(col, value)}>
                    <SelectTrigger className="border-none shadow-none h-8">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMN_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.slice(0, previewRows).map((row, i) => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={col} className="max-w-[200px] truncate">
                    {String(row[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPreviewRows(prev => (prev === 5 ? 10 : 5))}
          className="text-sm text-gray-600"
        >
          {previewRows === 5 ? (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show more rows
            </>
          ) : (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Show fewer rows
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onComplete({})}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" />
            Confirm Mapping
          </Button>
        </div>
      </div>
    </div>
  )
}