import BasePage from '@renderer/components/base/base-page'
import WebdavConfig from '@renderer/components/settings/webdav-config'
import GeneralConfig from '@renderer/components/settings/general-config'
import AdvancedSettings from '@renderer/components/settings/advanced-settings'
import Actions from '@renderer/components/settings/actions'
import ShortcutConfig from '@renderer/components/settings/shortcut-config'
import SiderConfig from '@renderer/components/settings/sider-config'
import SubStoreConfig from '@renderer/components/settings/substore-config'
import AppearanceConfig from '@renderer/components/settings/appearance-confis'

const Settings: React.FC = () => {
  return (
    <BasePage
      title="应用设置"
      header={<></>}
    >
      <GeneralConfig />
      <AppearanceConfig />
      <SubStoreConfig />
      <SiderConfig />
      <WebdavConfig />
      <AdvancedSettings />
      <ShortcutConfig />
      <Actions />
    </BasePage>
  )
}

export default Settings
