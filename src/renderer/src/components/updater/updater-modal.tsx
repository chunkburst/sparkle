import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Code,
  Progress
} from '@heroui/react'
import ReactMarkdown from 'react-markdown'
import React, { useState } from 'react'
import { downloadAndInstallUpdate } from '@renderer/utils/ipc'
import { useAppConfig } from '@renderer/hooks/use-app-config'
import { FiX, FiDownload } from 'react-icons/fi'

interface Props {
  version: string
  changelog: string
  updateStatus?: {
    downloading: boolean
    progress: number
    error?: string
  }
  onCancel?: () => void
  onClose: () => void
}

const UpdaterModal: React.FC<Props> = (props) => {
  const { version, changelog, updateStatus, onCancel, onClose } = props
  const { appConfig: { disableAnimation = false } = {} } = useAppConfig()
  const [downloading, setDownloading] = useState(false)
  const onUpdate = async (): Promise<void> => {
    try {
      setDownloading(true)
      await downloadAndInstallUpdate(version)
    } catch (e) {
      alert(e)
      setDownloading(false)
    }
  }
  const handleCancel = (): void => {
    if (updateStatus?.downloading && onCancel) {
      setDownloading(false)
      onCancel()
    } else {
      onClose()
    }
  }

  const isDownloading = updateStatus?.downloading || downloading

  return (
    <Modal
      backdrop={disableAnimation ? 'transparent' : 'blur'}
      disableAnimation={disableAnimation}
      classNames={{ backdrop: 'top-[48px]' }}
      hideCloseButton
      isOpen={true}
      onOpenChange={onClose}
      scrollBehavior="inside"
      isDismissable={!isDownloading}
    >
      <ModalContent className="h-full w-[calc(100%-100px)]">
        <ModalHeader className="flex justify-between app-drag">
          <div className="flex items-center gap-2">
            <FiDownload className="text-lg" />
            {version} 版本就绪
          </div>
          {!isDownloading && (
            <Button
              color="primary"
              size="sm"
              className="flex app-nodrag"
              onPress={() => {
                // 下载最新版本
              }}
            >
              前往下载
            </Button>
          )}
        </ModalHeader>
        <ModalBody className="h-full">
          {updateStatus?.downloading && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-600">下载进度</span>
                <span className="text-sm font-medium">{updateStatus.progress}%</span>
              </div>
              <Progress
                value={updateStatus.progress}
                color="primary"
                size="sm"
                showValueLabel={false}
              />
              {updateStatus.error && (
                <div className="text-danger text-sm">{updateStatus.error}</div>
              )}
            </div>
          )}
          {!updateStatus?.downloading && (
            <div className="markdown-body select-text">
              <ReactMarkdown
                components={{
                  a: ({ ...props }) => <a target="_blank" className="text-primary" {...props} />,
                  code: ({ children }) => <Code size="sm">{children}</Code>,
                  h3: ({ ...props }) => <h3 className="text-lg font-bold" {...props} />,
                  li: ({ children }) => <li className="list-disc list-inside">{children}</li>
                }}
              >
                {changelog}
              </ReactMarkdown>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="light"
            onPress={handleCancel}
            startContent={updateStatus?.downloading ? <FiX /> : undefined}
          >
            {updateStatus?.downloading ? '取消下载' : '取消'}
          </Button>
          {!updateStatus?.downloading && (
            <Button
              size="sm"
              color="primary"
              isLoading={downloading}
              startContent={<FiDownload />}
              onPress={onUpdate}
            >
              立即更新
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdaterModal
