import { Button, Card, CardBody } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useAppConfig } from '@renderer/hooks/use-app-config'
import { useControledMihomoConfig } from '@renderer/hooks/use-controled-mihomo-config'
import { triggerSysProxy } from '@renderer/utils/ipc'
import { calcTraffic } from '@renderer/utils/calc'
import { FiZap, FiShield } from 'react-icons/fi'
import { IoPower } from 'react-icons/io5'
import VpnIcon from '@renderer/components/base/vpn-icon'

interface TrafficData {
  up: number
  down: number
}

const Dashboard: React.FC = () => {
  const { appConfig, patchAppConfig } = useAppConfig()
  const { controledMihomoConfig } = useControledMihomoConfig()
  const { sysProxy, onlyActiveDevice = false } = appConfig || {}
  const { enable } = sysProxy || {}
  const [traffic, setTraffic] = useState<TrafficData>({ up: 0, down: 0 })
  const [connecting, setConnecting] = useState(false)
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    window.electron.ipcRenderer.on('mihomoTraffic', (_e, info: TrafficData) => {
      setTraffic(info)
    })

    const timer = setInterval(() => {
      if (enable) {
        setUptime((prev) => prev + 1)
      } else {
        setUptime(0)
      }
    }, 1000)

    return () => {
      window.electron.ipcRenderer.removeAllListeners('mihomoTraffic')
      clearInterval(timer)
    }
  }, [enable])

  const handleToggle = async (): Promise<void> => {
    setConnecting(true)
    try {
      const newEnable = !enable
      await triggerSysProxy(newEnable, onlyActiveDevice)
      await patchAppConfig({ sysProxy: { enable: newEnable } })
      window.electron.ipcRenderer.send('updateFloatingWindow')
      window.electron.ipcRenderer.send('updateTrayMenu')
    } catch (e) {
      alert(e)
    } finally {
      setConnecting(false)
    }
  }

  const formatUptime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}时${m}分${s}秒`
    if (m > 0) return `${m}分${s}秒`
    return `${s}秒`
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-cyan-50/10 dark:to-cyan-950/20">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <VpnIcon className="text-[80px]" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            炫连VPN
          </h1>
          <p className="text-sm text-default-500">安全·快速·稳定</p>
        </div>

        {/* Connect Button */}
        <div className="relative mt-4">
          {enable && (
            <div className="absolute -inset-4 rounded-full bg-cyan-400/20 animate-pulse" />
          )}
          <Button
            isIconOnly
            size="lg"
            className={`w-28 h-28 rounded-full border-4 transition-all duration-500 ${
              enable
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-400/40'
                : 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800 text-gray-400'
            }`}
            isLoading={connecting}
            onPress={handleToggle}
          >
            <IoPower className={`text-[40px] ${enable ? 'text-white' : ''}`} />
          </Button>
        </div>

        {/* Status */}
        <div className="flex flex-col items-center gap-1">
          <h2
            className={`text-xl font-bold ${enable ? 'text-cyan-500' : 'text-default-500'}`}
          >
            {enable ? '已连接' : '未连接'}
          </h2>
          <p className="text-sm text-default-400">
            {enable
              ? `已加速 ${formatUptime(uptime)}`
              : '点击按钮开始加速'}
          </p>
        </div>

        {/* Speed Cards */}
        <div className="flex gap-4 mt-2">
          <Card className="w-36 bg-content2/50">
            <CardBody className="flex flex-col items-center py-3">
              <FiZap className="text-cyan-400 text-xl mb-1" />
              <span className="text-xs text-default-500">上传</span>
              <span className="text-lg font-mono font-bold text-foreground">
                {calcTraffic(traffic.up)}/s
              </span>
            </CardBody>
          </Card>
          <Card className="w-36 bg-content2/50">
            <CardBody className="flex flex-col items-center py-3">
              <FiShield className="text-blue-400 text-xl mb-1" />
              <span className="text-xs text-default-500">下载</span>
              <span className="text-lg font-mono font-bold text-foreground">
                {calcTraffic(traffic.down)}/s
              </span>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
