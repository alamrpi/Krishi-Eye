import { useState, useRef } from 'react'
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { useUploadFile } from '../../hooks/useTransportApi'

interface FileUploadProps {
    label: string
    onUploadComplete: (url: string) => void
    accept?: string
    currentFileUrl?: string
}

export default function FileUpload({ label, onUploadComplete, accept = 'image/*', currentFileUrl }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentFileUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: uploadFile, isPending } = useUploadFile()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Create local preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Upload
        uploadFile(file, {
            onSuccess: (data: any) => {
                onUploadComplete(data.url)
            },
            onError: () => {
                setPreview(null)
            }
        })
    }

    const clearFile = () => {
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        onUploadComplete('')
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {preview ? (
                <div className="relative group">
                    {accept.startsWith('image/') ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg border border-gray-200"
                        />
                    ) : (
                        <div className="h-48 w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                            <DocumentIcon className="h-12 w-12 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">File selected</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed border-gray-300 rounded-lg p-6 
                        flex flex-col items-center justify-center cursor-pointer
                        hover:border-primary-500 hover:bg-gray-50 transition-colors
                        ${isPending ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        {isPending ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    )
}
