import { JSX } from 'react'
import { GenIcon, IconBaseProps } from 'react-icons'

function VpnIcon(props: IconBaseProps): JSX.Element {
  return GenIcon({
    tag: 'svg',
    attr: { viewBox: '0 0 24 24', fill: 'none' },
    child: [
      {
        tag: 'defs',
        child: [
          {
            tag: 'linearGradient',
            attr: { id: 'vpnGrad', x1: '0', y1: '0', x2: '1', y2: '1' },
            child: [
              { tag: 'stop', attr: { offset: '0%', stopColor: '#22d3ee' } },
              { tag: 'stop', attr: { offset: '100%', stopColor: '#3b82f6' } }
            ]
          }
        ]
      },
      {
        tag: 'path',
        attr: {
          d: 'M12 2L3 7v6c0 5.25 3.83 10.15 9 11 5.17-.85 9-5.75 9-11V7l-9-5z',
          fill: 'url(#vpnGrad)',
          stroke: 'url(#vpnGrad)',
          strokeWidth: '1'
        }
      },
      {
        tag: 'path',
        attr: {
          d: 'M8 12l3 3 5-5',
          stroke: 'white',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'none'
        }
      }
    ]
  })(props)
}

export default VpnIcon
