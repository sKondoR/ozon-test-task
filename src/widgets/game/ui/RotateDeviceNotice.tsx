import { faMobileScreen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Браузер не даёт запретить поворот экрана обычной странице
 * (screen.orientation.lock работает только в полноэкранном режиме),
 * поэтому в альбомной ориентации на тач-устройствах закрываем игру подсказкой.
 */
export function RotateDeviceNotice() {
  return (
    <div role="alert" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-hud p-6 text-center text-white">
      <FontAwesomeIcon icon={faMobileScreen} className="text-5xl text-wheat" aria-hidden />
      <p className="text-lg font-semibold">Поверните устройство вертикально</p>
    </div>
  )
}
